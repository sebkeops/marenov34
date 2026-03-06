/**
 * Tests de non-régression — Phase 3
 * Vérifie que la connexion Supabase côté public est correctement structurée.
 */

const fs = require('fs')
const path = require('path')

// ─── Fichiers requis ───────────────────────────────────────────

describe("Phase 3 — fichiers requis", () => {
  const requiredFiles = [
    'src/lib/supabase-server.js',
    'src/app/page.js',
    'src/app/realisations/[slug]/page.js',
  ]

  requiredFiles.forEach((file) => {
    test(`le fichier ${file} existe`, () => {
      expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true)
    })
  })
})

// ─── supabase-server.js ────────────────────────────────────────

describe("supabase-server.js", () => {
  test("exporte createServerClient", () => {
    const content = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/supabase-server.js'),
      'utf-8'
    )
    expect(content).toContain('export function createServerClient')
  })

  test("utilise les variables d'env Supabase", () => {
    const content = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/supabase-server.js'),
      'utf-8'
    )
    expect(content).toContain('NEXT_PUBLIC_SUPABASE_URL')
    expect(content).toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  })
})

// ─── page.js (accueil) ────────────────────────────────────────

describe("page.js — page d'accueil", () => {
  const content = fs.readFileSync(
    path.join(process.cwd(), 'src/app/page.js'),
    'utf-8'
  )

  test("est un Server Component async", () => {
    expect(content).toContain('export default async function')
  })

  test("importe createServerClient", () => {
    expect(content).toContain("createServerClient")
  })

  test("charge les services depuis Supabase", () => {
    expect(content).toContain('"services"')
  })

  test("charge les families depuis Supabase", () => {
    expect(content).toContain('"families"')
  })

  test("charge la section artisan depuis Supabase", () => {
    expect(content).toContain('"artisan"')
  })

  test("charge la section spotlight depuis Supabase", () => {
    expect(content).toContain('"spotlight"')
  })

  test("utilise Promise.all pour les requêtes parallèles", () => {
    expect(content).toContain('Promise.all')
  })

  test("les familles sont des liens vers /realisations/[id]", () => {
    expect(content).toContain('/realisations/')
  })

  test("la section spotlight est conditionnelle sur visible", () => {
    expect(content).toContain('spotlight?.visible')
  })
})

// ─── page galerie /realisations/[id] ─────────────────────────

describe("page galerie realisations/[slug]", () => {
  const content = fs.readFileSync(
    path.join(process.cwd(), 'src/app/realisations/[slug]/page.js'),
    'utf-8'
  )

  test("est un Server Component async", () => {
    expect(content).toContain('export default async function')
  })

  test("charge les photos depuis family_photos", () => {
    expect(content).toContain('family_photos')
  })

  test("filtre par family_id", () => {
    expect(content).toContain('family_id')
  })

  test("trie les photos par order", () => {
    expect(content).toContain('"order"')
  })

  test("appelle notFound si la famille n'existe pas", () => {
    expect(content).toContain('notFound')
  })

  test("exporte generateMetadata", () => {
    expect(content).toContain('export async function generateMetadata')
  })

  test("contient un lien de retour vers la page d'accueil", () => {
    expect(content).toContain('href="/"')
  })
})
