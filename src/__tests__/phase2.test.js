/**
 * Tests de non-régression — Phase 2
 * Vérifie la structure des composants admin et les règles métier critiques.
 */

import '@testing-library/jest-dom'
import ImageUpload from '@/components/admin/ImageUpload'
import { render, screen } from '@testing-library/react'

// Mock Supabase pour ne pas faire de vraies requêtes
jest.mock('@/lib/supabase', () => ({
  supabase: {
    storage: {
      from: () => ({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/image.jpg' } }),
      }),
    },
    auth: {
      signOut: jest.fn(),
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    },
    from: () => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ error: null }),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [] }),
      single: jest.fn().mockResolvedValue({ data: null }),
    }),
  },
  createClient: jest.fn(),
}))

// ─── ImageUpload ──────────────────────────────────────────────

describe("ImageUpload — composant", () => {
  test("affiche le bouton de sélection sans image courante", () => {
    render(<ImageUpload currentUrl="" onUploaded={jest.fn()} />)
    expect(screen.getByText("Choisir une image")).toBeInTheDocument()
  })

  test("affiche 'Changer l'image' quand une image est déjà présente", () => {
    render(<ImageUpload currentUrl="https://example.com/img.jpg" onUploaded={jest.fn()} />)
    expect(screen.getByText("Changer l'image")).toBeInTheDocument()
  })

  test("affiche un aperçu quand une image est fournie", () => {
    render(<ImageUpload currentUrl="https://example.com/img.jpg" onUploaded={jest.fn()} />)
    const img = screen.getByRole("img", { name: "Aperçu" })
    expect(img).toHaveAttribute("src", "https://example.com/img.jpg")
  })

  test("n'affiche pas d'aperçu sans image", () => {
    render(<ImageUpload currentUrl="" onUploaded={jest.fn()} />)
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })
})

// ─── Structure des routes admin ───────────────────────────────

describe("Structure des routes admin", () => {
  const fs = require('fs')
  const path = require('path')

  const adminRoutes = [
    'src/app/admin/page.js',
    'src/app/admin/login/page.js',
    'src/app/admin/layout.js',
    'src/app/admin/services/page.js',
    'src/app/admin/realisations/page.js',
    'src/app/admin/realisations/[id]/page.js',
    'src/app/admin/spotlight/page.js',
    'src/app/admin/artisan/page.js',
  ]

  adminRoutes.forEach((route) => {
    test(`le fichier ${route} existe`, () => {
      const fullPath = path.join(process.cwd(), route)
      expect(fs.existsSync(fullPath)).toBe(true)
    })
  })

  test("le proxy de protection existe", () => {
    const fullPath = path.join(process.cwd(), 'src/proxy.js')
    expect(fs.existsSync(fullPath)).toBe(true)
  })

  test("le layout admin existe avec le timer d'inactivité", () => {
    const fullPath = path.join(process.cwd(), 'src/app/admin/layout.js')
    const content = fs.readFileSync(fullPath, 'utf-8')
    expect(content).toContain('INACTIVITY_TIMEOUT_MS')
    expect(content).toContain('15 * 60 * 1000')
  })

  test("le composant ImageUpload existe", () => {
    const fullPath = path.join(process.cwd(), 'src/components/admin/ImageUpload.js')
    expect(fs.existsSync(fullPath)).toBe(true)
  })
})
