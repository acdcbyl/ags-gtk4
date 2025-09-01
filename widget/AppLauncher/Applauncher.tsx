import { App, Gtk, hook, Gdk, Astal } from "astal/gtk4";
import { Variable } from "astal";
import Pango from "gi://Pango";
import AstalApps from "gi://AstalApps";
import PopupWindow from "../../common/PopupWindow";
import { Gio } from "astal";
import options from "../../option";
const { bar } = options;

const layout = Variable.derive(
  [bar.position, bar.start, bar.center, bar.end],
  (pos, start, center, end) => {
    if (start.includes("launcher")) return `${pos}_left`;
    if (center.includes("launcher")) return `${pos}_center`;
    if (end.includes("launcher")) return `${pos}_right`;

    return `${pos}_center`;
  },
);

const { wallpaper } = options;
const apps = new AstalApps.Apps();
const text = Variable("");

export const WINDOW_NAME = "app-launcher";

function hide() {
  App.get_window(WINDOW_NAME)?.set_visible(false);
}

function AppButton({ app }: { app: AstalApps.Application }) {
  return (
    <button
      cssClasses={["app-button"]}
      onClicked={() => {
        hide();
        app.launch();
      }}
    >
      <box spacing={8}>
        <image iconName={app.iconName} pixelSize={32} />
        <box valign={Gtk.Align.CENTER} vertical>
          <label
            cssClasses={["name"]}
            ellipsize={Pango.EllipsizeMode.END}
            xalign={0}
            label={app.name}
          />
          {app.description && (
            <label
              cssClasses={["description"]}
              ellipsize={Pango.EllipsizeMode.END}
              maxWidthChars={24}
              wrap
              xalign={0}
              label={app.description}
            />
          )}
        </box>
      </box>
    </button>
  );
}

function SearchEntry() {
  const onEnter = () => {
    const results = apps.fuzzy_query(text.get());
    if (results && results.length > 0) {
      results[0].launch();
      hide();
    }
  };
  return (
    <overlay cssClasses={["entry-overlay"]} heightRequest={60}>
      <entry
        type="overlay"
        vexpand
        primaryIconName={"system-search-symbolic"}
        placeholderText="Search..."
        text={text.get()}
        setup={(self) => {
          hook(self, App, "window-toggled", (_, win) => {
            const winName = win.name;
            const visible = win.visible;
            if (winName == WINDOW_NAME && visible) {
              text.set("");
              self.set_text("");
              self.grab_focus();
            }
          });
        }}
        onChanged={(self) => text.set(self.text)}
        onActivate={onEnter}
      />
    </overlay>
  );
}

function AppsScrolledWindow() {
  const list = text((text) => apps.fuzzy_query(text));

  return (
    <Gtk.ScrolledWindow vexpand>
      <box spacing={6} vertical>
        {list.as((list) => list.map((app) => <AppButton app={app} />))}
        <box
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}
          cssClasses={["not-found"]}
          vertical
          vexpand
          visible={list.as((l) => l.length === 0)}
        >
          <image
            iconName="system-search-symbolic"
            iconSize={Gtk.IconSize.LARGE}
          />
          <label label="No match found" />
        </box>
      </box>
    </Gtk.ScrolledWindow>
  );
}

export default function Applauncher(_gdkmonitor: Gdk.Monitor) {
  return (
    <PopupWindow name={WINDOW_NAME} layout="top_left" margin={10}>
      <box
        cssClasses={["applauncher-container"]}
        vertical
        vexpand={false}
      >
        <SearchEntry />
        <AppsScrolledWindow />
      </box>
    </PopupWindow>
  );
}
