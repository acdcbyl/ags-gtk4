import { App } from "astal/gtk4";
import { time } from "../../../lib/utils";
import PanelButton from "../PanelButton";
import { WINDOW_NAME } from "../../Dashbord/Dashboard";

export default function TimePanelButton({ format = "%a %d %b, %H:%M" }) {
	return (
		<PanelButton
			window={WINDOW_NAME}
			onClicked={() => App.toggle_window(WINDOW_NAME)}
		>
			<label label={time((t) => t.format(format)!)} />
		</PanelButton>
	);
}
