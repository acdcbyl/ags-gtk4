import { App } from "astal/gtk4";
import AstalNotifd from "gi://AstalNotifd";
import { bind } from "astal";
import { time } from "../../../lib/utils";
import PanelButton from "../PanelButton";
import { WINDOW_NAME } from "../../Dashbord/Dashboard";

const notifd = AstalNotifd.get_default();
export default function TimePanelButton({ format = "%a %d %b, %H:%M" }) {
	return (
		<PanelButton
			window={WINDOW_NAME}
			onClicked={() => App.toggle_window(WINDOW_NAME)}
		>
			<box>
				<label label={time((t) => t.format(format)!)} />
				<label
					cssClasses={["clock-notificount"]}
					label={bind(notifd, "notifications").as((n) => n.length.toString())} />
			</box>
		</PanelButton>
	);
}
