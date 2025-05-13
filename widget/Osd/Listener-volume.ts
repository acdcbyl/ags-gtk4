import { monitorFile, readFileAsync } from "astal/file";
import GLib from "gi://GLib?version=2.0";
import AstalWp from "gi://AstalWp";
import { setOSD } from "./Osd";
import { bind } from "astal";


// TODO: Also do the keyboard.
// This might a tad trickier because there are many LEDs available.

export function startVolume() {
  const speaker = AstalWp.get_default()?.audio!.defaultSpeaker!;
  {
    bind(speaker, "volume").as(value => (
      setOSD("display-brightness-symbolic", value)))
  }
}
