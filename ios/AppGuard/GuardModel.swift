import Foundation
import FamilyControls
import ManagedSettings
import DeviceActivity
import SwiftUI

extension DeviceActivityName {
    /// 1 日を通したシールド再適用用のアクティビティ名
    static let daily = Self("daily")
}

/// 認証・ガード対象アプリの選択・シールド適用を司るメインアプリのモデル。
@MainActor
final class GuardModel: ObservableObject {
    @Published var selection = FamilyActivitySelection()
    @Published var authStatus: AuthorizationStatus = AuthorizationCenter.shared.authorizationStatus
    @Published var isShielding = false

    @Published var reasons: [Reason] = SharedStore.shared.reasons()
    @Published var todayLogs: [OpenLog] = SharedStore.shared.todayLogs()
    @Published var todayCount: Int = SharedStore.shared.todayCountAll()

    private let store = ManagedSettingsStore()
    private let center = DeviceActivityCenter()
    private let defaults = UserDefaults(suiteName: kAppGroup) ?? .standard
    private let kSelection = "selection"

    init() {
        loadSelection()
        isShielding = store.shield.applications?.isEmpty == false
            || store.shield.applicationCategories != nil
    }

    // MARK: - 認証

    func requestAuthorization() async {
        do {
            try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
        } catch {
            // ユーザーが拒否 / 失敗。状態だけ更新する。
        }
        authStatus = AuthorizationCenter.shared.authorizationStatus
    }

    // MARK: - 選択の永続化

    private func loadSelection() {
        if let data = defaults.data(forKey: kSelection),
           let decoded = try? JSONDecoder().decode(FamilyActivitySelection.self, from: data) {
            selection = decoded
        }
    }

    func saveSelection() {
        if let data = try? JSONEncoder().encode(selection) {
            defaults.set(data, forKey: kSelection)
        }
        if isShielding { applyShields() }
    }

    // MARK: - シールド（ブロック）

    func applyShields() {
        let apps = selection.applicationTokens
        let cats = selection.categoryTokens
        store.shield.applications = apps.isEmpty ? nil : apps
        store.shield.applicationCategories = cats.isEmpty ? nil : .specific(cats)
        isShielding = true
        scheduleDailyReapply()
    }

    func clearShields() {
        store.shield.applications = nil
        store.shield.applicationCategories = nil
        isShielding = false
        center.stopMonitoring([.daily])
    }

    /// Monitor 拡張が 1 日の境目でシールドを再適用できるよう、終日スケジュールを登録する。
    private func scheduleDailyReapply() {
        let schedule = DeviceActivitySchedule(
            intervalStart: DateComponents(hour: 0, minute: 0),
            intervalEnd: DateComponents(hour: 23, minute: 59),
            repeats: true
        )
        try? center.startMonitoring(.daily, during: schedule)
    }

    func setShielding(_ on: Bool) {
        if on { applyShields() } else { clearShields() }
    }

    // MARK: - データ更新

    /// アプリがフォアグラウンドに戻ったときに呼ぶ。
    /// シールド拡張が一時解除したアプリを、再びブロック状態へ戻す。
    func refresh() {
        reasons = SharedStore.shared.reasons()
        todayLogs = SharedStore.shared.todayLogs()
        todayCount = SharedStore.shared.todayCountAll()
        if isShielding { applyShields() } // 一時解除されたトークンを再シールド
    }

    // MARK: - 理由の編集

    func addReason(label: String, kind: ReasonKind) {
        let trimmed = label.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        reasons.append(Reason(id: UUID().uuidString, label: trimmed, kind: kind))
        SharedStore.shared.saveReasons(reasons)
    }

    func removeReason(_ reason: Reason) {
        reasons.removeAll { $0.id == reason.id }
        SharedStore.shared.saveReasons(reasons)
    }

    func tag(log: OpenLog, reasonId: String?) {
        SharedStore.shared.setReason(logId: log.id, reasonId: reasonId)
        todayLogs = SharedStore.shared.todayLogs()
    }
}
