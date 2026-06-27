import SwiftUI

@main
struct AppGuardApp: App {
    @StateObject private var model = GuardModel()
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(model)
                .preferredColorScheme(.dark)
                .onChange(of: scenePhase) { phase in
                    if phase == .active { model.refresh() }
                }
        }
    }
}
