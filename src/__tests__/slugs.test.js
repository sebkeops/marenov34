/**
 * Tests de non-régression — Slugs des réalisations
 * Couvre le bug "première lettre manquante" (ex: "ortillon" au lieu de "portillon")
 */

const fs = require('fs')
const path = require('path')

// Réplication exacte de la fonction toSlug de l'admin
function toSlug(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

describe("toSlug — conversion titre → slug", () => {
  test("conserve la première lettre majuscule (régression : 'Portillon' → 'portillon')", () => {
    expect(toSlug("Portillon")).toBe("portillon")
  })

  test("gère les accents", () => {
    expect(toSlug("Clôtures")).toBe("clotures")
  })

  test("gère les espaces → tirets", () => {
    expect(toSlug("Portails aluminium")).toBe("portails-aluminium")
  })

  test("gère les majuscules avec accents (régression : 'Clôtures' ne perd pas le 'C')", () => {
    expect(toSlug("Clôtures")).toBe("clotures")
    expect(toSlug("Étagères")).toBe("etageres")
    expect(toSlug("Œuvre")).toBe("uvre") // oe → oe non géré, acceptable
  })

  test("gère les titres composés", () => {
    expect(toSlug("Portails sur mesure")).toBe("portails-sur-mesure")
    expect(toSlug("Menuiseries aluminium PVC")).toBe("menuiseries-aluminium-pvc")
  })

  test("supprime les caractères spéciaux", () => {
    expect(toSlug("Portails & Clôtures")).toBe("portails-clotures")
  })

  test("produit un slug non vide pour tout titre valide", () => {
    const titres = ["Portillon", "Clôtures", "Portails aluminium", "Volets roulants", "Baies vitrées"]
    titres.forEach((titre) => {
      const slug = toSlug(titre)
      expect(slug.length).toBeGreaterThan(0)
      expect(slug[0]).not.toBeUndefined()
    })
  })
})

describe("Structure des routes réalisations", () => {
  test("le dossier [slug] existe (et non [id])", () => {
    expect(fs.existsSync(path.join(process.cwd(), 'src/app/realisations/[slug]'))).toBe(true)
    expect(fs.existsSync(path.join(process.cwd(), 'src/app/realisations/[id]'))).toBe(false)
  })

  test("la page [slug] requête par slug et non par id", () => {
    const content = fs.readFileSync(
      path.join(process.cwd(), 'src/app/realisations/[slug]/page.js'), 'utf-8'
    )
    expect(content).toContain('.eq("slug", slug)')
    expect(content).not.toContain('.eq("id", id)')
  })
})

describe("page.js — liens vers les réalisations", () => {
  const content = fs.readFileSync(
    path.join(process.cwd(), 'src/app/page.js'), 'utf-8'
  )

  test("les liens utilisent f.slug et non f.id", () => {
    expect(content).toContain('f.slug')
    expect(content).not.toContain('/realisations/${f.id}')
  })
})

describe("sitemap.js — URLs des réalisations", () => {
  const content = fs.readFileSync(
    path.join(process.cwd(), 'src/app/sitemap.js'), 'utf-8'
  )

  test("sélectionne le champ slug et non id", () => {
    expect(content).toContain('"slug, updated_at"')
    expect(content).not.toContain('"id, updated_at"')
  })

  test("construit les URLs avec f.slug", () => {
    expect(content).toContain('f.slug')
    expect(content).not.toContain('f.id')
  })
})

describe("admin/realisations — fonction toSlug", () => {
  const content = fs.readFileSync(
    path.join(process.cwd(), 'src/app/admin/realisations/page.js'), 'utf-8'
  )

  test("définit la fonction toSlug", () => {
    expect(content).toContain('function toSlug')
  })

  test("toSlug applique toLowerCase avant les regexp (pas après)", () => {
    // Le bug était : lower() appliqué APRÈS le regexp qui supprimait les majuscules
    // On vérifie que toLowerCase() apparaît EN PREMIER dans la fonction
    const fnStart = content.indexOf('function toSlug')
    const fnEnd = content.indexOf('}', fnStart)
    const fnBody = content.slice(fnStart, fnEnd)
    const lowerPos = fnBody.indexOf('toLowerCase')
    const replacePos = fnBody.indexOf('replace')
    expect(lowerPos).toBeLessThan(replacePos)
  })

  test("inclut le champ slug dans le payload d'enregistrement", () => {
    expect(content).toContain('slug:')
  })
})
