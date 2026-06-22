// Small helper to sanitize and map a narrow set of CMS-provided HTML
// into safe HTML with inline styles so Tailwind classes stored in CMS
// content still render correctly even when not present in compiled CSS.
export function mapCmsHtml(input = ''): string {
  if (!input) return ''

  // Run only in browser environment where DOMParser exists
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return input

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(input, 'text/html')

    const allowedTags = new Set(['BR', 'EM', 'STRONG', 'I', 'B', 'SPAN'])

    function walk(node: Node) {
      const children = Array.from(node.childNodes)
      for (const child of children) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child as HTMLElement
          // Remove any disallowed tags entirely but keep their text
          if (!allowedTags.has(el.tagName)) {
            const frag = document.createDocumentFragment()
            while (el.firstChild) frag.appendChild(el.firstChild)
            el.parentNode?.replaceChild(frag, el)
            continue
          }

          // Map known CMS classes to inline styles
          const styles: string[] = []
          const cls = (el.className || '').split(/\s+/).filter(Boolean)
          for (const c of cls) {
            if (c === 'text-teal-mid' || c === 'text-teal') {
              // approximate brand teal color used across the site
              styles.push('color: #0d9488')
            }
            if (c === 'italic') {
              styles.push('font-style: italic')
            }
            // add more mappings here if you store other Tailwind classes in CMS
          }

          // Apply inline style if any mapped
          if (styles.length) {
            const prev = el.getAttribute('style') || ''
            el.setAttribute('style', prev + (prev && prev.trim().slice(-1) !== ';' ? ';' : '') + styles.join('; '))
          }

          // Remove class attribute so Tailwind purge doesn't rely on it here
          if (el.hasAttribute('class')) el.removeAttribute('class')

          // Recurse
          walk(el)
        }
      }
    }

    walk(doc.body)

    return doc.body.innerHTML
  } catch (err) {
    // On any error, fall back to returning raw input
    return input
  }
}
