import { useEffect, useMemo, useState } from 'react'
import type { Location } from 'react-router-dom'

import { navItems, type SidebarNavChild } from './sidebarMenu.config'

export type SidebarLocation = Pick<Location, 'pathname' | 'search' | 'hash'>

type ParsedTarget = {
  pathname: string
  search: string
  hash: string
}

function parseTo(to: string): ParsedTarget {
  const [pathAndSearch, rawHash] = to.split('#')
  const [pathname, rawSearch] = pathAndSearch.split('?')

  return {
    pathname,
    search: rawSearch ? `?${rawSearch}` : '',
    hash: rawHash ? `#${rawHash}` : '',
  }
}

function getIsChildActive(location: SidebarLocation, childTo: string) {
  const target = parseTo(childTo)

  if (target.search) {
    return location.pathname === target.pathname && location.search === target.search
  }

  if (target.hash) {
    return location.pathname === target.pathname && location.hash === target.hash
  }

  const isPathMatch =
    location.pathname === target.pathname || location.pathname.startsWith(`${target.pathname}/`)

  if (!isPathMatch) {
    return false
  }

  return !location.search && !location.hash
}

function getActiveSectionLabels(location: SidebarLocation) {
  return navItems
    .filter((section) => section.children.some((child) => getIsChildActive(location, child.to)))
    .map((section) => section.label)
}

export function useSidebarMenuState(location: SidebarLocation) {
  const activeSectionLabels = useMemo(
    () => getActiveSectionLabels(location),
    [location.hash, location.pathname, location.search],
  )

  const [expandedSection, setExpandedSection] = useState<string | null>(
    activeSectionLabels[0] ?? null,
  )

  useEffect(() => {
    if (activeSectionLabels.length === 0) {
      return
    }

    const nextActive = activeSectionLabels[0]
    setExpandedSection((prev) => (prev === nextActive ? prev : nextActive))
  }, [activeSectionLabels])

  const isChildActive = (childTo: SidebarNavChild['to']) => getIsChildActive(location, childTo)

  const isSectionActive = (sectionChildren: readonly SidebarNavChild[]) =>
    sectionChildren.some((child) => isChildActive(child.to))

  const handleToggleSection = (sectionLabel: string) => {
    setExpandedSection((prev) => (prev === sectionLabel ? null : sectionLabel))
  }

  return {
    expandedSection,
    isChildActive,
    isSectionActive,
    handleToggleSection,
  }
}
