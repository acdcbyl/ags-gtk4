import PanelButton from "../PanelButton";
import { WINDOW_NAME } from "../../AppLauncher/Applauncher";
import { App } from "astal/gtk4";

export default function LauncherPanelButton() {
	return (
		<PanelButton
			cssClasses={["applauncher-bg"]}
			window={WINDOW_NAME}
			onClicked={() => App.toggle_window(WINDOW_NAME)}
		>
			<image iconName="os-linux-arch-symbolic" />
		</PanelButton>
	);
}
