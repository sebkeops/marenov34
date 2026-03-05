/**
 * Tests de non-régression — Phase 0
 * Vérifie que le contenu réel est en place et que les éléments supprimés sont bien absents.
 */

import site from '@/content/site.json'
import services from '@/content/services.json'
import projects from '@/content/projects.json'
import { getSite, getServices, getProjects } from '@/lib/data'

// ─── site.json ───────────────────────────────────────────────────────────────

describe("site.json — contenu réel", () => {
  test("le nom de l'entreprise est correct", () => {
    expect(site.businessName).toBe("M.A Rénov")
  })

  test("le numéro de téléphone est correct", () => {
    expect(site.phone).toBe("06 59 02 90 28")
  })

  test("l'email est correct", () => {
    expect(site.email).toBe("ste.marenov@gmail.com")
  })

  test("la ville est correcte", () => {
    expect(site.city).toBe("Restinclières")
  })

  test("la zone d'intervention est correcte", () => {
    expect(site.serviceArea).toBe("Restinclières et 50 km aux alentours")
  })

  test("aucun placeholder [Nom] ou [Ville] ne reste", () => {
    const raw = JSON.stringify(site)
    expect(raw).not.toMatch(/\[Nom\]/)
    expect(raw).not.toMatch(/\[Ville\]/)
    expect(raw).not.toMatch(/exemple\.fr/)
    expect(raw).not.toMatch(/06 00 00 00 00/)
  })

  test("les champs obligatoires sont présents", () => {
    expect(site.businessName).toBeTruthy()
    expect(site.phone).toBeTruthy()
    expect(site.email).toBeTruthy()
    expect(site.city).toBeTruthy()
    expect(site.serviceArea).toBeTruthy()
    expect(site.tagline).toBeTruthy()
  })
})

// ─── services.json ───────────────────────────────────────────────────────────

describe("services.json — vrais services", () => {
  test("contient 4 services", () => {
    expect(services).toHaveLength(4)
  })

  test("chaque service a un titre, une description et une image", () => {
    services.forEach((s) => {
      expect(s.title).toBeTruthy()
      expect(s.desc).toBeTruthy()
      expect(s.image).toBeTruthy()
    })
  })

  test("les anciens services placeholder ne sont plus présents", () => {
    const titles = services.map((s) => s.title)
    expect(titles).not.toContain("Meubles sur mesure")
    expect(titles).not.toContain("Dressing & rangements")
    expect(titles).not.toContain("Terrasse bois")
  })

  test("les vrais services sont présents", () => {
    const titles = services.map((s) => s.title)
    expect(titles).toContain("Portails sur mesure & automatismes")
    expect(titles).toContain("Clôtures")
    expect(titles).toContain("Menuiseries aluminium sur mesure")
    expect(titles).toContain("Travaux divers")
  })
})

// ─── data.js ─────────────────────────────────────────────────────────────────

describe("data.js — fonctions d'accès aux données", () => {
  test("getSite() retourne les données du site", () => {
    const data = getSite()
    expect(data.businessName).toBe("M.A Rénov")
  })

  test("getServices() retourne un tableau de services", () => {
    const data = getServices()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
  })

  test("getProjects() retourne un tableau de projets", () => {
    const data = getProjects()
    expect(Array.isArray(data)).toBe(true)
  })

  test("getTestimonials n'est plus exporté", () => {
    const dataModule = require('@/lib/data')
    expect(dataModule.getTestimonials).toBeUndefined()
  })
})

// ─── projects.json ───────────────────────────────────────────────────────────

describe("projects.json — pas de localisation", () => {
  test("aucun projet n'a de champ city", () => {
    projects.forEach((p) => {
      expect(p.city).toBeUndefined()
    })
  })
})
