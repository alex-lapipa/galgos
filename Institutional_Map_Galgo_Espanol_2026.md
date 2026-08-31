---
document_id: "GE-11-INSTITUTIONS-01"
title: "Institutional and Organizational Map of the Galgo Español in Spain"
slug: "galgo-espanol-institutional-map"
batch: "11"
document_type: "institutional_mapping"
language: "en"
source_languages: ["en", "es"]
period_start: "1911"
period_end: "2026"
geographies: ["Spain", "European Union", "United Kingdom", "Netherlands", "United States"]
dog_types: ["galgo", "sighthound", "hunting dog"]
topics: ["institutional landscape", "animal welfare", "rescue networks", "hunting governance", "coursing", "breed governance", "animal law", "advocacy", "veterinary science", "abandonment statistics"]
entities: ["Ley 7/2023", "Campeonato de España de Galgos en Campo", "FCI Standard No. 285", "hunting-dog exemption"]
people: ["Anna Clements", "Albert Sordé", "Fermín Pérez", "Gisela Mehnert", "Tina Solera", "Javier Luna", "Luis Ángel Vegas", "Manuel Gallardo Casado", "Sergio García Torres", "Nuria Menéndez de Llano"]
evidence_level: "confirmed"
source_quality: "mixed_primary_secondary_partisan"
created_at: "2026-08-31"
updated_at: "2026-08-31"
version: "1.0"
review_status: "source-mapped"
graph_nodes:
  - {type: organization, label: "SOS Galgos", properties: {organization_type: "RESCUE_SHELTER", stance: "ANTI_HUNTING"}}
  - {type: organization, label: "Protectora y Santuario Scooby", properties: {organization_type: "RESCUE_SHELTER", stance: "ANTI_HUNTING"}}
  - {type: organization, label: "Fundación Benjamín Mehnert", properties: {organization_type: "RESCUE_SHELTER", stance: "WELFARE_NEUTRAL"}}
  - {type: organization, label: "Galgos del Sol", properties: {organization_type: "RESCUE_SHELTER", stance: "WELFARE_NEUTRAL"}}
  - {type: organization, label: "Galgos del Sur", properties: {organization_type: "RESCUE_SHELTER", stance: "ANTI_HUNTING"}}
  - {type: organization, label: "Galgos 112", properties: {organization_type: "RESCUE_SHELTER", stance: "ANTI_HUNTING"}}
  - {type: organization, label: "112 Carlota Galgos", properties: {organization_type: "RESCUE_SHELTER", stance: "ANTI_HUNTING"}}
  - {type: organization, label: "Greyhounds in Need UK", properties: {organization_type: "RESCUE_NETWORK_INTL", stance: "WELFARE_NEUTRAL"}}
  - {type: organization, label: "Galgo Rescue International Network", properties: {organization_type: "RESCUE_NETWORK_INTL", stance: "WELFARE_NEUTRAL"}}
  - {type: organization, label: "Project Galgo", properties: {organization_type: "RESCUE_NETWORK_INTL", stance: "ANTI_HUNTING"}}
  - {type: organization, label: "SAGE — Save A Galgo Español", properties: {organization_type: "RESCUE_NETWORK_INTL", stance: "WELFARE_NEUTRAL"}}
  - {type: organization, label: "Federación Española de Galgos", properties: {organization_type: "HUNTING_FEDERATION", stance: "PRO_HUNTING"}}
  - {type: organization, label: "Real Federación Española de Caza", properties: {organization_type: "HUNTING_FEDERATION", stance: "PRO_HUNTING"}}
  - {type: organization, label: "Real Sociedad Canina de España", properties: {organization_type: "BREED_KENNEL_CLUB", stance: "REGULATORY"}}
  - {type: organization, label: "Club Nacional del Galgo Español", properties: {organization_type: "BREED_KENNEL_CLUB", stance: "REGULATORY"}}
  - {type: organization, label: "Fédération Cynologique Internationale", properties: {organization_type: "BREED_KENNEL_CLUB", stance: "REGULATORY"}}
  - {type: organization, label: "Dirección General de Derechos de los Animales", properties: {organization_type: "GOVERNMENT_AGENCY", stance: "REGULATORY"}}
  - {type: organization, label: "Ministerio de Agricultura, Pesca y Alimentación", properties: {organization_type: "GOVERNMENT_AGENCY", stance: "REGULATORY"}}
  - {type: organization, label: "SEPRONA", properties: {organization_type: "GOVERNMENT_AGENCY", stance: "REGULATORY"}}
  - {type: organization, label: "Plataforma NAC", properties: {organization_type: "UMBRELLA_COALITION", stance: "ANTI_HUNTING"}}
  - {type: organization, label: "PACMA", properties: {organization_type: "POLITICAL_PARTY", stance: "ANTI_HUNTING"}}
  - {type: organization, label: "AnimaNaturalis", properties: {organization_type: "ADVOCACY_POLICY", stance: "ANTI_HUNTING"}}
  - {type: organization, label: "CAS International", properties: {organization_type: "ADVOCACY_POLICY", stance: "ANTI_HUNTING"}}
  - {type: organization, label: "INTERcids", properties: {organization_type: "LEGAL", stance: "WELFARE_NEUTRAL"}}
  - {type: organization, label: "Observatorio Justicia y Defensa Animal", properties: {organization_type: "LEGAL", stance: "ANTI_HUNTING"}}
  - {type: organization, label: "FAADA", properties: {organization_type: "LEGAL", stance: "WELFARE_NEUTRAL"}}
  - {type: organization, label: "Fundación Affinity", properties: {organization_type: "VETERINARY_SCIENTIFIC", stance: "WELFARE_NEUTRAL"}}
  - {type: law, label: "Ley 7/2023", properties: {jurisdiction: "Spain"}}
  - {type: policy, label: "hunting-dog exemption in Ley 7/2023", properties: {evidence_status: "confirmed"}}
  - {type: event, label: "Campeonato de España de Galgos en Campo", properties: {category: "coursing"}}
graph_relationships:
  - {subject: "Federación Española de Galgos", subject_type: organization, predicate: "HOSTS_EVENT", object: "Campeonato de España de Galgos en Campo", object_type: event, confidence: 1.0}
  - {subject: "Club Nacional del Galgo Español", subject_type: organization, predicate: "MEMBER_OF", object: "Real Sociedad Canina de España", object_type: organization, confidence: 1.0}
  - {subject: "Real Sociedad Canina de España", subject_type: organization, predicate: "MEMBER_OF", object: "Fédération Cynologique Internationale", object_type: organization, confidence: 1.0}
  - {subject: "Real Federación Española de Caza", subject_type: organization, predicate: "OPPOSED_TO", object: "Plataforma NAC", object_type: organization, confidence: 0.95}
  - {subject: "Real Federación Española de Caza", subject_type: organization, predicate: "OPPOSED_TO", object: "Dirección General de Derechos de los Animales", object_type: organization, confidence: 0.95}
  - {subject: "SOS Galgos", subject_type: organization, predicate: "OPPOSED_TO", object: "hunting-dog exemption in Ley 7/2023", object_type: policy, confidence: 1.0}
  - {subject: "Plataforma NAC", subject_type: organization, predicate: "OPPOSED_TO", object: "hunting-dog exemption in Ley 7/2023", object_type: policy, confidence: 1.0}
  - {subject: "PACMA", subject_type: organization, predicate: "OPPOSED_TO", object: "hunting-dog exemption in Ley 7/2023", object_type: policy, confidence: 1.0}
  - {subject: "AnimaNaturalis", subject_type: organization, predicate: "OPPOSED_TO", object: "hunting-dog exemption in Ley 7/2023", object_type: policy, confidence: 1.0}
  - {subject: "CAS International", subject_type: organization, predicate: "OPPOSED_TO", object: "hunting-dog exemption in Ley 7/2023", object_type: policy, confidence: 1.0}
  - {subject: "AnimaNaturalis", subject_type: organization, predicate: "COLLABORATES_WITH", object: "CAS International", object_type: organization, confidence: 1.0}
  - {subject: "Greyhounds in Need UK", subject_type: organization, predicate: "FUNDER_OF", object: "Galgos del Sol", object_type: organization, confidence: 0.95}
  - {subject: "Project Galgo", subject_type: organization, predicate: "PARTNER_OF", object: "Fundación Benjamín Mehnert", object_type: organization, confidence: 1.0}
  - {subject: "SAGE — Save A Galgo Español", subject_type: organization, predicate: "PARTNER_OF", object: "Fundación Benjamín Mehnert", object_type: organization, confidence: 1.0}
  - {subject: "INTERcids", subject_type: organization, predicate: "COLLABORATES_WITH", object: "Galgos 112", object_type: organization, confidence: 1.0}
  - {subject: "Dirección General de Derechos de los Animales", subject_type: organization, predicate: "REGULATES_VIA", object: "Ley 7/2023", object_type: law, confidence: 1.0}
  - {subject: "PACMA", subject_type: organization, predicate: "COLLABORATES_WITH", object: "Galgos del Sur", object_type: organization, confidence: 0.8}
---

# Institutional and Organizational Map of the Galgo Español in Spain

## Purpose and evidence status

This canonical record converts the strongest, explicitly structured parts of the uploaded **Organizational & Institutional Mapping of the Galgo Español (Spain)** into retrieval- and graph-ready form. The original uploaded Markdown remains the source record. This document does **not** upgrade every statement in that research batch to verified fact: founding-date conflicts, self-reported scale figures, partisan claims and abandonment estimates retain the qualifications given by the source.

The source describes a field organized around several interacting systems rather than one unified "galgo sector": hunting/coursing governance, rescue and international adoption, formal cynology, government regulation, animal-welfare advocacy, legal action, veterinary/scientific institutions, media and local cultural hosts.

## 1. Rescue and welfare network

The best-developed Spanish rescue nodes in the source are **SOS Galgos, Protectora y Santuario Scooby, Fundación Benjamín Mehnert, Galgos del Sol, Galgos del Sur, Galgos 112 and 112 Carlota Galgos**. The source also maps a structurally important international layer including **Greyhounds in Need UK, Galgo Rescue International Network (GRIN), Project Galgo and SAGE**.

A central institutional insight is that rescue is transnational. Spanish shelters are linked to Northern-European, UK and US adoption, funding and transport networks. This relationship should be understood as an organizational network, not as evidence for any biological movement or lineage of the breed.

## 2. Hunting and coursing establishment

The source identifies the **Federación Española de Galgos (FEG)** as the central sport-governing body for open-field galgo coursing and the organizer of the **Campeonato de España de Galgos en Campo — Copa de S.M. El Rey**. It identifies the **Real Federación Española de Caza (RFEC)** as the wider national hunting federation and an important policy actor.

Membership and licence totals are source-sensitive. RFEC's own figure of more than 350,000 people is self-reported. The research batch gives an independently commissioned Deloitte/Fundación Artemisan figure of 330,423 federated sport-hunters and 891,889 valid autonomous hunting licences as of 31 December 2023. These figures describe different denominators and should never be collapsed into one measure.

## 3. Cynological governance

The **Real Sociedad Canina de España (RSCE)** is presented as custodian of the Libro de Orígenes Español and the national kennel-club layer connected to the **Fédération Cynologique Internationale (FCI)**. The **Club Nacional del Galgo Español (CNGE)** is the breed-specific association affiliated to the RSCE. This is a different institutional system from field coursing governance even where participants and interests may overlap.

## 4. Government and enforcement

The mapping identifies the **Dirección General de Derechos de los Animales**, **Ministerio de Agricultura, Pesca y Alimentación (MAPA)** and **SEPRONA** as distinct public-sector nodes. Their roles differ: policy/animal-rights administration, agricultural/animal-health administration, and law-enforcement/environmental protection.

The research treats **Ley 7/2023** and its exclusion of hunting dogs from the companion-animal regime as the major recent institutional conflict. Welfare organizations campaigned against that exemption, while hunting organizations defended a separate regulatory treatment. This graph records the documented positions as `OPPOSED_TO` relationships; it does not infer motives beyond the source.

## 5. Advocacy, legal and policy organizations

The principal policy/advocacy nodes include **Plataforma NAC, PACMA, AnimaNaturalis and CAS International**. The source explicitly records collaboration between AnimaNaturalis and CAS International and opposition by these organizations to the hunting-dog exemption.

The legal-professional layer includes **INTERcids, Observatorio Justicia y Defensa Animal and FAADA**. The source links INTERcids to litigation concerning galgo cruelty and collaboration with Galgos 112.

## 6. Scientific and statistical anchors

**Fundación Affinity** is important because its abandonment/adoption studies provide a broader methodological anchor than single-issue campaign estimates. The source reports that its 2024 publication estimated 286,682 companion animals abandoned in 2023, including 170,712 dogs and 115,970 cats, and listed end of hunting season as one reported cause. Those figures refer to the participating study framework and are not a direct census of galgos.

## 7. Abandonment statistics: explicitly contested

The uploaded research is unusually valuable because it does not flatten conflicting abandonment figures. It states that Spain lacks an official national statistic specifically establishing the widely repeated **50,000–100,000 galgos per year** claim and traces that range through advocacy/media circulation including the 2016 *Yo Galgo* campaign. It also records far lower SEPRONA-derived figures cited by hunting-side sources and a PACMA protectora survey reporting 5,588 galgos in 2019.

These are **different data-generating systems** and cannot be treated as directly interchangeable measurements. In this knowledge base the 50,000–100,000 range remains **CONTESTED**, not a graph fact. No numeric abandonment claim from this document is converted into a causal or verified knowledge-graph relationship.

## 8. Institutional conflict map

The most analytically useful explicit network in the source is the conflict around the hunting-dog exemption in **Ley 7/2023**:

- SOS Galgos → `OPPOSED_TO` → hunting-dog exemption
- Plataforma NAC → `OPPOSED_TO` → hunting-dog exemption
- PACMA → `OPPOSED_TO` → hunting-dog exemption
- AnimaNaturalis → `OPPOSED_TO` → hunting-dog exemption
- CAS International → `OPPOSED_TO` → hunting-dog exemption
- RFEC → `OPPOSED_TO` → Plataforma NAC
- RFEC → `OPPOSED_TO` → Dirección General de Derechos de los Animales

These edges describe documented institutional positions. They do not imply that disagreement is symmetric in power, evidence quality or political influence.

## 9. Partnership and governance edges

The uploaded source explicitly supports the following organizational relationships used in the graph:

- FEG → `HOSTS_EVENT` → Campeonato de España de Galgos en Campo
- CNGE → `MEMBER_OF` → RSCE
- RSCE → `MEMBER_OF` → FCI
- AnimaNaturalis → `COLLABORATES_WITH` → CAS International
- Greyhounds in Need UK → `FUNDER_OF` → Galgos del Sol
- Project Galgo → `PARTNER_OF` → Fundación Benjamín Mehnert
- SAGE → `PARTNER_OF` → Fundación Benjamín Mehnert
- INTERcids → `COLLABORATES_WITH` → Galgos 112
- Dirección General de Derechos de los Animales → `REGULATES_VIA` → Ley 7/2023
- PACMA → `COLLABORATES_WITH` → Galgos del Sur, with lower confidence because the source characterizes this principally through leadership overlap.

## 10. Known gaps retained from the source

The following remain incomplete or unverified in the uploaded research and are not promoted to strong graph claims:

- conflicting founding dates for some organizations;
- exact founding year for INTERcids;
- autonomous-community registries and bodies beyond high-level references;
- long-tail regional protectoras and several German/Dutch/French partners;
- commercial transport entities;
- any dedicated Museo del Galgo;
- some local championship-host claims;
- partisan hunting-media allegations about welfare organizations;
- self-reported rescue volumes where independent registry evidence is absent.

## Source basis

Primary basis: `compass_artifact_wf-2bff7e45-e211-5090-bb0c-5247bc9b6224_text_markdown.md`, uploaded to the GALGOS GitHub repository on 31 August 2026. That batch cites organizational websites, BOE material, Fundación Affinity, Newtral, La Marea, Deloitte/Fundación Artemisan and partisan hunting/advocacy media, with caveats recorded in the original document.

## Suggested RAG questions

- What organizations govern the Galgo Español in Spain?
- How do the rescue, hunting and cynological systems differ?
- Which organizations opposed the hunting-dog exemption in Ley 7/2023?
- What is the relationship between CNGE, RSCE and the FCI?
- Which international organizations fund or partner with Spanish galgo rescues?
- Why are estimates of annual galgo abandonment contested?
- What role do SEPRONA and Fundación Affinity play in the evidence debate?
- Show the institutional network around Ley 7/2023 with provenance.
