import type { HighlighterCore } from 'shiki/core'

export type Lang = 'tsx' | 'bash' | 'css' | 'html' | 'json'

let highlighter: Promise<HighlighterCore> | undefined

function load() {
  highlighter ??= Promise.all([import('shiki/core'), import('shiki/engine/javascript')]).then(
    ([{ createHighlighterCore }, { createJavaScriptRegexEngine }]) =>
      createHighlighterCore({
        themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark.mjs')],
        langs: [
          import('shiki/langs/tsx.mjs'),
          import('shiki/langs/bash.mjs'),
          import('shiki/langs/css.mjs'),
          import('shiki/langs/html.mjs'),
          import('shiki/langs/json.mjs'),
        ],
        engine: createJavaScriptRegexEngine(),
      }),
  )
  return highlighter
}

const cache = new Map<string, string>()

export function cached(code: string, lang: Lang) {
  return cache.get(lang + code)
}

export async function highlight(code: string, lang: Lang) {
  const key = lang + code
  if (!cache.has(key)) {
    const h = await load()
    cache.set(
      key,
      h.codeToHtml(code, {
        lang,
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: false,
      }),
    )
  }
  return cache.get(key)!
}
