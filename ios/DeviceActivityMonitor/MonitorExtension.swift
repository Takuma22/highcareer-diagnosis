import DeviceActivity
import FamilyControls
import ManagedSettings
import Foundation

/// 1 日の境目などのスケジュールに合わせてシールドを再適用するための拡張。
/// 一時解除されたアプリを確実にブロックへ戻す保険として使う。
final class MonitorExtension: DeviceActivityMonitor {

    private let store = ManagedSettingsStore()
    private let defaults = UserDefaults(suiteName: kAppGroup) ?? .standard

    private func reapplyShields() {
        guard let data = defaults.data(forKey: "selection"),
              let selection = try? JSONDecoder().decode(FamilyActivitySelection.self, from: data)
        else { return }
        store.shield.applications = selection.applicationTokens.isEmpty
            ? nil : selection.applicationTokens
        store.shield.applicationCategories = selection.categoryTokens.isEmpty
            ? nil : .specific(selection.categoryTokens)
    }

    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        reapplyShields()
    }

    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        reapplyShields()
    }
}
