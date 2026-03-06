/**
 * Tests de non-régression — Phase 4
 * Vérifie la présence et la structure des éléments SEO.
 */

const fs = require('fs')
const path = require('path')

describe("Phase 4 — fichiers SEO requis", () => {
  const requiredFiles = [
    'src/app/sitemap.js',
    'src/app/robots.js',
  ]

  requiredFiles.forEach((file) => {
    test(`le fichier ${file} existe`, () => {
      expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true)
    })
  })
})

describe("sitemap.js", () => {
  const content = fs.readFileSync(
    path.join(process.cwd(), 'src/app/sitemap.js'), 'utf-8'
  )

  test("exporte une fonction default async", () => {
    expect(content).toContain('export default async function sitemap')
  })

  test("inclut l'URL de base du site", () => {
    expect(content).toContain('marenov34.vercel.app')
  })

  test("inclut les URLs des familles de réalisations", () => {
    expect(content).toContain('/realisations/')
  })
})

describe("robots.js", () => {
  const content = fs.readFileSync(
    path.join(process.cwd(), 'src/app/robots.js'), 'utf-8'
  )

  test("bloque /admin", () => {
    expect(content).toContain('disallow')
    expect(content).toContain('/admin')
  })

  test("autorise le reste du site", () => {
    expect(content).toContain('allow')
  })

  test("référence le sitemap", () => {
    expect(content).toContain('sitemap')
  })
})

describe("layout.js — SEO", () => {
  const content = fs.readFileSync(
    path.join(process.cwd(), 'src/app/layout.js'), 'utf-8'
  )

  test("contient les métadonnées de base avec title template", () => {
    expect(content).toContain('template')
    expect(content).toContain('%s')
  })

  test("contient metadataBase", () => {
    expect(content).toContain('metadataBase')
  })

  test("contient les balises openGraph", () => {
    expect(content).toContain('openGraph')
  })

  test("contient le Schema.org LocalBusiness", () => {
    expect(content).toContain('LocalBusiness')
    expect(content).toContain('application/ld+json')
  })

  test("contient le numéro de téléphone", () => {
    expect(content).toContain('+33659029028')
  })
})

describe("page.js — generateMetadata", () => {
  const content = fs.readFileSync(
    path.join(process.cwd(), 'src/app/page.js'), 'utf-8'
  )

  test("exporte generateMetadata", () => {
    expect(content).toContain('export async function generateMetadata')
  })

  test("inclut openGraph dans les métadonnées", () => {
    expect(content).toContain('openGraph')
  })
})
