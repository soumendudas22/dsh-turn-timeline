# Turn Timeline for DeepSeek Harness

A DeepSeek Harness (DSH) plugin that lays out each chat turn's reasoning and tool calls on a timeline, with a rail and live status dots.

## What it does

- Draws a thin timeline rail through each turn's process group, so reasoning steps and tool calls read as one sequence.
- Marks every step with a status dot:
  - a small dot for reasoning,
  - a hollow ring while a tool's arguments are being prepared,
  - a solid accent dot while a step is running,
  - red when a tool call failed,
  - amber when a tool call was stopped or interrupted.
- Wraps process groups in calm, padded surfaces.
- Uses the active theme's colours, so it looks right in both light and dark themes.
- Respects your system's reduced-motion setting.
- It is a stylesheet only: it doesn't change how turns fold, how search works, or how individual tools are displayed.

## Requirements

- The DeepSeek Harness Web app.
- Developed and tested against DSH 0.2.1-alpha.2.
- The plugin styles the chat through its `data-*` attributes. A future DSH release that changes those attributes could need an update to this plugin.

## Install

```sh
dsh plugin --profile web add @soumendudas22/dsh-turn-timeline
```

`web` is the profile the DeepSeek Harness Web app uses; replace it if you run the app under another profile.

Then reload the Web app.

You can also install straight from GitHub. The plugin is plain JavaScript and CSS, so no build step is needed:

```sh
dsh plugin --profile web add github:soumendudas22/dsh-turn-timeline#v1.0.0
```

## Verify

Check that the plugin is part of your profile's configuration:

```sh
dsh --profile web --dump-config
```

The output should include a `# == @soumendudas22/dsh-turn-timeline` layer.

## Disable or remove

- To turn it off temporarily, toggle it on the Web app's plugin page.
- To uninstall it:

  ```sh
  dsh plugin --profile web remove @soumendudas22/dsh-turn-timeline
  ```

## Development

Clone this repository and link your checkout into a profile:

```sh
git clone https://github.com/soumendudas22/dsh-turn-timeline.git
dsh plugin --profile web add ./dsh-turn-timeline
```

| File | Purpose |
| --- | --- |
| `index.js` | Server-side entry. It does nothing; all of the work happens in the browser. |
| `client.js` | Browser module that adds the timeline stylesheet to the chat. |
| `cordis.patch.yml` | Tells DSH to load the plugin. |
| `locale/` | Plugin title and description in English and Chinese. |
| `icon.svg` | Plugin icon shown in the Web app. |

## License

[MIT](LICENSE)
