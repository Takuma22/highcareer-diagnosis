import ManagedSettings

/// シールド上のボタンが押されたときの処理。
/// - primary（開く）: 開いた記録を 1 件残し、そのアプリのシールドを一時解除して中に入れる。
///   一時解除はメインアプリを次に開いたとき（GuardModel.refresh）に再適用される。
/// - secondary（やめる）: アプリを閉じてブロックを維持する。
final class ShieldActionHandler: ShieldActionDelegate {

    private func allowOnce(_ token: ApplicationToken) {
        let app = Application(token: token)
        SharedStore.shared.addOpen(
            tokenKey: tokenKey(token),
            appName: app.localizedDisplayName ?? "アプリ"
        )
        // このアプリだけシールドから外して、今回の起動を通す。
        let store = ManagedSettingsStore()
        if var apps = store.shield.applications {
            apps.remove(token)
            store.shield.applications = apps.isEmpty ? nil : apps
        }
    }

    override func handle(
        action: ShieldAction,
        for application: ApplicationToken,
        completionHandler: @escaping (ShieldActionResponse) -> Void
    ) {
        switch action {
        case .primaryButtonPressed:
            allowOnce(application)
            completionHandler(.none)      // シールドを閉じてアプリへ進む
        case .secondaryButtonPressed:
            completionHandler(.close)     // アプリを閉じる
        @unknown default:
            completionHandler(.close)
        }
    }

    override func handle(
        action: ShieldAction,
        for category: ActivityCategoryToken,
        completionHandler: @escaping (ShieldActionResponse) -> Void
    ) {
        // カテゴリ単位では個別アプリのトークンが取れないため、記録のみ行い閉じる挙動に統一。
        switch action {
        case .primaryButtonPressed:
            completionHandler(.none)
        case .secondaryButtonPressed:
            completionHandler(.close)
        @unknown default:
            completionHandler(.close)
        }
    }

    override func handle(
        action: ShieldAction,
        for webDomain: WebDomainToken,
        completionHandler: @escaping (ShieldActionResponse) -> Void
    ) {
        switch action {
        case .primaryButtonPressed:
            completionHandler(.none)
        case .secondaryButtonPressed:
            completionHandler(.close)
        @unknown default:
            completionHandler(.close)
        }
    }
}
