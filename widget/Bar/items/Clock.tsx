import { App } from "astal/gtk4";
import AstalNotifd from "gi://AstalNotifd";
import { bind } from "astal";
import { time } from "../../../lib/utils";
import PanelButton from "../PanelButton";
import AstalApps from "gi://AstalApps";
import AstalMpris from "gi://AstalMpris?version=0.1";
import { Variable } from "astal";
import { WINDOW_NAME } from "../../Dashbord/Dashboard";
import { Label } from "astal/gtk4/widget";

const notifd = AstalNotifd.get_default();
const mpris = AstalMpris.get_default();

// 全局 Variable 来跟踪是否有播放器正在播放
export const isPlaying = Variable(false);

// 检查是否有播放器正在播放的函数
const checkPlayingStatus = () => {
	const players = mpris.get_players();
	const playing = players.some(player => player.playbackStatus === AstalMpris.PlaybackStatus.PLAYING);
	isPlaying.set(playing);
};

// 为每个现有播放器添加监听器
const handlePlayers = () => {
	mpris.get_players().forEach((player) => {
		player.connect("notify::playback-status", checkPlayingStatus);
	});
	checkPlayingStatus(); // 立即检查一次状态
};

// 监听播放器的添加和移除
mpris.connect("player-added", (_, player) => {
	player.connect("notify::playback-status", checkPlayingStatus);
	checkPlayingStatus();
});

mpris.connect("player-closed", checkPlayingStatus);

// 初始化
handlePlayers();

function NotifIcon() {
	const getVisible = () =>
		notifd.dont_disturb ? true : notifd.notifications.length <= 0;
	const visibility = Variable(getVisible())
		.observe(notifd, "notify::dont-disturb", () => {
			return getVisible();
		})
		.observe(notifd, "notify::notifications", () => getVisible());
	return (
		<image
			onDestroy={() => visibility.drop()}
			visible={visibility()}
			cssClasses={["icon"]}
			iconName={bind(notifd, "dont_disturb").as(
				(dnd) => `notifications-${dnd ? "disabled-" : ""}symbolic`,
			)}
		/>
	);
}

export default function TimePanelButton({ format = "%a,%H:%M" }) {
	const apps = new AstalApps.Apps();

	const substitute: {
		"Screen Recorder": string;
		Screenshot: string;
		Hyprpicker: string;
		rmpc: string;
		foamshot: string;
		kew: string;
		"change-color": string;
		[key: string]: string | undefined;
	} = {
		"Screen Recorder": "screencast-recorded-symbolic",
		Screenshot: "screenshot-recorded-symbolic",
		Hyprpicker: "color-select-symbolic",
		foamshot: "screenshot-recorded-symbolic",
		rmpc: "folder-music-symbolic",
		kew: "library-music-symbolic",
		musicfox: "folder-music-symbolic",
		"change-color": "preferences-desktop-theme-global-symbolic",
	};

	return (
		<PanelButton
			window={WINDOW_NAME}
			onClicked={() => App.toggle_window(WINDOW_NAME)}
		>
			<box spacing={12}>
				<image
					visible={isPlaying()} // 直接使用全局的 isPlaying Variable
					iconName={"music-playing-symbolic"}
				/>
				<label label={time((t) => t.format(format)!)} />
				{bind(notifd, "dontDisturb").as((dnd) =>
					!dnd ? (
						<box spacing={6}>
							{bind(notifd, "notifications").as((n) => {
								if (n.length > 0) {
									return [
										<image
											cssClasses={["circle"]}
											iconName={"message-notif-symbolic"}
										/>,
									];
								}
								return <NotifIcon />;
							})}
						</box>
					) : (
						<NotifIcon />
					),
				)}
			</box>
		</PanelButton>
	);
}
