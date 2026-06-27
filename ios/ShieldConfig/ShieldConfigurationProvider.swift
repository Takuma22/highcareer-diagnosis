import ManagedSettings
import ManagedSettingsUI
import UIKit

/// ガード対象アプリを開いたときに表示される「シールド（割り込み画面）」の見た目を作る。
/// iOS のシールドはボタンが 2 つ（primary / secondary）までという制約があるため、
/// スクショの 4 択ではなく「開く（記録する）／やめる」の 2 択にしている。
/// 開いた理由はメインアプリのダッシュボードで後から付与できる。
final class ShieldConfigurationProvider: ShieldConfigurationDataSource {

    private func make(appName: String, token: ApplicationToken?) -> ShieldConfiguration {
        let count = token.map { SharedStore.shared.todayCount(tokenKey: tokenKey($0)) } ?? 0
        let line = count > 0
            ? "今日はすでに \(count) 回開いています\n本当に開く？"
            : "今日はまだ開いていません\n本当に開く？"

        return ShieldConfiguration(
            backgroundBlurStyle: .systemThinMaterialDark,
            backgroundColor: UIColor(red: 0.035, green: 0.043, blue: 0.10, alpha: 0.96),
            icon: nil,
            title: ShieldConfiguration.Label(
                text: "\(appName) を開こうとしています",
                color: .white
            ),
            subtitle: ShieldConfiguration.Label(
                text: line,
                color: UIColor(white: 0.78, alpha: 1.0)
            ),
            primaryButtonLabel: ShieldConfiguration.Label(
                text: "開く（記録する）",
                color: .white
            ),
            primaryButtonBackgroundColor: UIColor(red: 0.29, green: 0.40, blue: 0.86, alpha: 1.0),
            secondaryButtonLabel: ShieldConfiguration.Label(
                text: "やめる",
                color: UIColor(white: 0.7, alpha: 1.0)
            )
        )
    }

    override func configuration(shielding application: Application) -> ShieldConfiguration {
        make(appName: application.localizedDisplayName ?? "このアプリ", token: application.token)
    }

    override func configuration(
        shielding application: Application,
        in category: ActivityCategory
    ) -> ShieldConfiguration {
        make(appName: application.localizedDisplayName ?? "このアプリ", token: application.token)
    }

    override func configuration(shielding webDomain: WebDomain) -> ShieldConfiguration {
        make(appName: webDomain.domain ?? "このサイト", token: nil)
    }

    override func configuration(
        shielding webDomain: WebDomain,
        in category: ActivityCategory
    ) -> ShieldConfiguration {
        make(appName: webDomain.domain ?? "このサイト", token: nil)
    }
}
