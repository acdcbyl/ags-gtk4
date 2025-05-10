import { execAsync, GLib } from "astal";
import { mkOptions, opt } from "./lib/option";
import { gsettings } from "./lib/utils";

const options = mkOptions(
  `${GLib.get_user_config_dir()}/aiser-astal/config.json`,
  {
    wallpaper: {
      folder: opt(`${GLib.get_home_dir()}/Pictures/Star`, { cached: true }),
      current: opt(
        await execAsync("swww query")
          .then((out) => out.split("image:")[1].trim())
          .catch(() => ""),
        { cached: true },
      ),
    },
    dock: {
      position: opt("bottom"),
      pinned: opt(["firefox", "Alacritty", "org.gnome.Nautilus", "localsend"]),
    },
    bar: {
      position: opt("top"),
      separator: opt(true),
      start: opt(["launcher", "workspace", "activeapp"]),
      center: opt(["time"]),
      end: opt(["network_speed", "notification", "tray", "quicksetting", "powermenu"]),
    },
    desktop_clock: {
      position: opt<
        | "top_left"
        | "top"
        | "top_right"
        | "left"
        | "center"
        | "right"
        | "bottom_left"
        | "bottom"
        | "bottom_right"
      >("top_left"),
    },
    theme: {
      mode: opt(
        gsettings.get_string("color-scheme") == "prefer-light"
          ? "light"
          : "dark",
        { cached: true },
      ),
    },
  },
);

export default options;
