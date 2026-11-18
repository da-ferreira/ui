import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { DocsLayout } from './layout/DocsLayout'
import { SiteHeader } from './layout/SiteHeader'
import { ComponentPage } from './pages/ComponentPage'
import { Components } from './pages/Components'
import { Home } from './pages/Home'
import { Installation } from './pages/Installation'
import { Introduction } from './pages/Introduction'
import { NotFound } from './pages/NotFound'
import { Theming } from './pages/Theming'

export function App() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
    else document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
  }, [pathname, hash])

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <Routes>
        <Route index element={<Home />} />
        <Route path="docs" element={<DocsLayout />}>
          <Route index element={<Introduction />} />
          <Route path="installation" element={<Installation />} />
          <Route path="theming" element={<Theming />} />
          <Route path="components" element={<Components />} />
          <Route path="components/:slug" element={<ComponentPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
