import Foundation
import ManagedSettings

// メインアプリと各 App Extension で共有するデータ層。
// すべてのターゲットにこのファイルを含める（App Group 経由で UserDefaults を共有）。

let kAppGroup = "group.com.example.appguard"

enum ReasonKind: String, Codable {
    case good   // 緑（前向き）
    case bad    // 赤（つい開いてしまう）
}

struct Reason: Codable, Identifiable, Hashable {
    let id: String
    var label: String
    var kind: ReasonKind
}

struct OpenLog: Codable, Identifiable {
    let id: String
    let tokenKey: String   // アプリトークンを base64 文字列化したキー
    let appName: String
    var reasonId: String?  // 後からダッシュボードで理由を付与できる
    let at: Double         // epoch 秒
}

/// ApplicationToken を UserDefaults のキーに使える安定した文字列へ変換する。
func tokenKey(_ token: ApplicationToken) -> String {
    guard let data = try? JSONEncoder().encode(token) else { return "unknown" }
    return data.base64EncodedString()
}

final class SharedStore {
    static let shared = SharedStore()

    private let defaults = UserDefaults(suiteName: kAppGroup) ?? .standard
    private let kReasons = "reasons"
    private let kLogs = "logs"

    private let defaultReasons: [Reason] = [
        Reason(id: "kill-time", label: "暇つぶし", kind: .bad),
        Reason(id: "nantonaku", label: "なんとなく", kind: .bad),
        Reason(id: "work", label: "仕事で", kind: .good),
        Reason(id: "research", label: "調べ物", kind: .good),
    ]

    // MARK: - Reasons

    func reasons() -> [Reason] {
        guard let data = defaults.data(forKey: kReasons),
              let list = try? JSONDecoder().decode([Reason].self, from: data),
              !list.isEmpty else {
            return defaultReasons
        }
        return list
    }

    func saveReasons(_ reasons: [Reason]) {
        if let data = try? JSONEncoder().encode(reasons) {
            defaults.set(data, forKey: kReasons)
        }
    }

    // MARK: - Open logs

    func logs() -> [OpenLog] {
        guard let data = defaults.data(forKey: kLogs),
              let list = try? JSONDecoder().decode([OpenLog].self, from: data) else {
            return []
        }
        return list
    }

    private func saveLogs(_ logs: [OpenLog]) {
        // 直近 500 件だけ保持
        let trimmed = Array(logs.suffix(500))
        if let data = try? JSONEncoder().encode(trimmed) {
            defaults.set(data, forKey: kLogs)
        }
    }

    /// シールドの「開く」ボタンが押されたときに 1 件記録する。
    func addOpen(tokenKey: String, appName: String) {
        var current = logs()
        current.append(
            OpenLog(
                id: UUID().uuidString,
                tokenKey: tokenKey,
                appName: appName,
                reasonId: nil,
                at: Date().timeIntervalSince1970
            )
        )
        saveLogs(current)
    }

    /// ダッシュボードから後付けで理由を設定する。
    func setReason(logId: String, reasonId: String?) {
        var current = logs()
        if let i = current.firstIndex(where: { $0.id == logId }) {
            current[i].reasonId = reasonId
            saveLogs(current)
        }
    }

    // MARK: - 集計

    private func isToday(_ epoch: Double) -> Bool {
        Calendar.current.isDateInToday(Date(timeIntervalSince1970: epoch))
    }

    func todayLogs() -> [OpenLog] {
        logs().filter { isToday($0.at) }.sorted { $0.at > $1.at }
    }

    func todayCount(tokenKey key: String) -> Int {
        logs().filter { $0.tokenKey == key && isToday($0.at) }.count
    }

    func todayCountAll() -> Int {
        logs().filter { isToday($0.at) }.count
    }
}
