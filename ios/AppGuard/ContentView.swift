import SwiftUI
import FamilyControls

struct ContentView: View {
    @EnvironmentObject var model: GuardModel
    @State private var pickerPresented = false
    @State private var newReason = ""
    @State private var newReasonKind: ReasonKind = .bad

    private var isAuthorized: Bool { model.authStatus == .approved }

    var body: some View {
        NavigationStack {
            List {
                headerSection
                if !isAuthorized {
                    authSection
                } else {
                    selectionSection
                    todaySection
                    reasonsSection
                }
                footerSection
            }
            .navigationTitle("アプリ中毒ガード")
            .familyActivityPicker(isPresented: $pickerPresented, selection: $model.selection)
            .onChange(of: model.selection) { _ in model.saveSelection() }
        }
    }

    // MARK: - Sections

    private var headerSection: some View {
        Section {
            VStack(spacing: 6) {
                Text("📵").font(.system(size: 44))
                Text("開く前に「回数・理由」を突きつける")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
            }
            .frame(maxWidth: .infinity)
            .listRowBackground(Color.clear)
        }
    }

    private var authSection: some View {
        Section("はじめに") {
            Text("Screen Time（スクリーンタイム）の許可が必要です。許可するとガード対象のアプリを選べます。")
                .font(.footnote)
                .foregroundStyle(.secondary)
            Button {
                Task { await model.requestAuthorization() }
            } label: {
                Label("Screen Time を許可する", systemImage: "lock.shield")
            }
        }
    }

    private var selectionSection: some View {
        Section("ガードするアプリ") {
            let count = model.selection.applicationTokens.count
                + model.selection.categoryTokens.count
            Button {
                pickerPresented = true
            } label: {
                Label(
                    count == 0 ? "アプリ／カテゴリを選ぶ" : "選択中: \(count) 件（変更する）",
                    systemImage: "apps.iphone"
                )
            }

            Toggle(isOn: Binding(
                get: { model.isShielding },
                set: { model.setShielding($0) }
            )) {
                Label("ブロックを有効化", systemImage: "hand.raised")
            }
            .disabled(count == 0)
        }
    }

    private var todaySection: some View {
        Section("今日の記録（\(model.todayCount) 回）") {
            if model.todayLogs.isEmpty {
                Text("まだ記録がありません。ガード中のアプリを開くと、ここに「開いた回数」が積み上がります。")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            } else {
                ForEach(model.todayLogs) { log in
                    OpenLogRow(log: log)
                }
            }
        }
    }

    private var reasonsSection: some View {
        Section("理由の選択肢") {
            ForEach(model.reasons) { r in
                HStack {
                    Circle()
                        .fill(r.kind == .good ? Color.green : Color.red)
                        .frame(width: 8, height: 8)
                    Text(r.label)
                    Spacer()
                }
            }
            .onDelete { idx in
                idx.map { model.reasons[$0] }.forEach(model.removeReason)
            }
            HStack {
                TextField("新しい理由", text: $newReason)
                Button {
                    newReasonKind = newReasonKind == .good ? .bad : .good
                } label: {
                    Text(newReasonKind == .good ? "● 前向き" : "● つい")
                        .foregroundStyle(newReasonKind == .good ? .green : .red)
                        .font(.caption.bold())
                }
                .buttonStyle(.bordered)
                Button("追加") {
                    model.addReason(label: newReason, kind: newReasonKind)
                    newReason = ""
                }
                .disabled(newReason.trimmingCharacters(in: .whitespaces).isEmpty)
            }
        }
    }

    private var footerSection: some View {
        Section {
            Text("データは端末内（App Group）にのみ保存され、外部送信はありません。")
                .font(.caption2)
                .foregroundStyle(.secondary)
                .listRowBackground(Color.clear)
        }
    }
}

/// 今日開いたアプリ 1 件。後から理由を割り当てられる。
private struct OpenLogRow: View {
    @EnvironmentObject var model: GuardModel
    let log: OpenLog

    private var time: String {
        let f = DateFormatter()
        f.dateFormat = "HH:mm"
        return f.string(from: Date(timeIntervalSince1970: log.at))
    }

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(log.appName).font(.body)
                Text(time).font(.caption).foregroundStyle(.secondary)
            }
            Spacer()
            Menu {
                Button("理由なし") { model.tag(log: log, reasonId: nil) }
                ForEach(model.reasons) { r in
                    Button(r.label) { model.tag(log: log, reasonId: r.id) }
                }
            } label: {
                let current = model.reasons.first { $0.id == log.reasonId }
                Text(current?.label ?? "理由を選ぶ")
                    .font(.caption)
                    .foregroundStyle(current == nil ? .secondary : .primary)
            }
        }
    }
}
