import { Link } from 'react-router'
import { Command } from '../docs/Command'
import { C } from '../docs/Code'
import { PageHeader } from '../docs/PageHeader'
import { A, H2, P, UL } from '../docs/Prose'
import { GITHUB, NPM } from '../layout/nav'

export function Introduction() {
  return (
    <>
      <title>Introduction — @davidalmeida/ui</title>
      <PageHeader
        title="Introduction"
        description="React 19 + Tailwind 4 components that you copy into your project and own."
      />
      <P>
        This is not a dependency you import from. A small CLI copies the source of each component
        into your project — the same model as shadcn/ui — so you can read it, change it and keep it.
        The components are written by hand, without Radix or any headless library.
      </P>

      <H2>Principles</H2>
      <UL>
        <li>
          <strong className="font-medium text-ink">Your code.</strong> After <C>add</C>, the file is
          yours. <C>diff</C> shows what changed in a new version, and <C>--overwrite</C> is never
          the default.
        </li>
        <li>
          <strong className="font-medium text-ink">Tokens, not hex.</strong> Colors are CSS
          variables with light and dark values; redefine them to make it yours.
        </li>
        <li>
          <strong className="font-medium text-ink">Accessible.</strong> Focus stays inside modals,
          menus and the calendar work with the keyboard, the select uses{' '}
          <C>aria-activedescendant</C>.
        </li>
        <li>
          <strong className="font-medium text-ink">Texts are props.</strong> Built-in texts default
          to Brazilian Portuguese (<C>closeLabel</C>, <C>placeholder</C>, <C>locale</C>…); this site
          passes English ones.
        </li>
      </UL>

      <H2>Quick start</H2>
      <div className="flex flex-col gap-3">
        <Command args="init" />
        <Command args="add button" />
      </div>
      <P>
        See{' '}
        <Link
          to="/docs/installation"
          className="font-medium text-ink underline decoration-field underline-offset-4 hover:decoration-ink"
        >
          Installation
        </Link>{' '}
        for the details.
      </P>

      <H2>Links</H2>
      <UL>
        <li>
          Source: <A href={GITHUB}>github.com/da-ferreira/ui</A>
        </li>
        <li>
          Package: <A href={NPM}>npmjs.com/package/@davidalmeida/ui</A>
        </li>
      </UL>
    </>
  )
}
