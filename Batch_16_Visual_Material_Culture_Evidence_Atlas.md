---
document_id: "GE-16-VISUAL-01"
title: "Visual and Material Culture Evidence Atlas"
slug: "galgo-visual-material-culture-evidence-atlas"
batch: "16"
document_type: "visual_evidence_atlas"
language: "en"
source_languages: ["es", "en"]
period_start: "1100"
period_end: "2026"
geographies: ["Spain", "Iberian Peninsula"]
dog_types: ["galgo", "sighthound", "hunting dog", "greyhound-type dog"]
topics: ["visual culture", "painting", "fresco", "museum collections", "material evidence", "hunting iconography", "evidence semantics"]
entities: ["Museo del Prado", "San Baudelio de Berlanga", "Paul de Vos", "Torre de la Parada"]
people: ["Paul de Vos"]
evidence_level: "confirmed"
source_quality: "museum_primary_object_records"
created_at: "2026-08-31"
updated_at: "2026-08-31"
version: "1.0"
review_status: "source-verified"
---

# Visual and Material Culture Evidence Atlas

## Why visual evidence matters

GALGOS needs visual evidence for more than decoration. Paintings, frescoes, manuscripts, photographs, posters and museum objects can document how hunting dogs were represented, named, used and valued in different periods. But visual similarity is one of the easiest places to manufacture false continuity.

The governing rule is therefore:

**An image can support what it depicts and the context established by its object record. It cannot by appearance alone establish biological ancestry, stable population continuity or formal breed identity.**

## Evidence dimensions used in this atlas

Each visual record is classified separately across five dimensions:

1. **Function** — does the scene support coursing, hunting, companionship, sport or another role?
2. **Type** — does the depicted dog have an elongated/sighthound-like morphology?
3. **Population** — is there evidence tying the depicted dog to a traceable breeding population?
4. **Name** — does the contemporary record itself use `galgo`, `lebrel` or another relevant term?
5. **Formal breed** — is the object connected to the modern standardized Galgo Español as a recognized breed?

A strong score on function or type must never be silently promoted into population or formal-breed continuity.

## Record V01 — San Baudelio de Berlanga hunting frescoes

**Date:** first half of the 12th century, commonly c. 1125–1150 depending on object record.

**Place:** Hermitage of San Baudelio de Berlanga, Soria, Spain.

**Object class:** Romanesque wall painting / hunting scene.

**Evidence status:** confirmed visual evidence for hunting dogs in medieval Iberian imagery; breed identity unresolved.

The San Baudelio hunting cycle includes pursuit scenes with long-bodied, long-legged dogs. Museum and open-access reproductions preserve sections now dispersed among collections.

### What it supports

- hunting dogs were represented in an Iberian elite/secular hunting visual programme in the twelfth century;
- some dogs have a morphology compatible with a broad sighthound/coursing visual type;
- hunting imagery was culturally important enough to occupy a major decorative cycle.

### What it does not support

- that the dogs were called Galgo Español in the modern breed sense;
- uninterrupted breeding continuity from those depicted dogs to modern galgos;
- a genetic connection recoverable solely from body shape;
- a precise breed standard.

**Continuity dimensions:** function = strong; type = plausible/strong visual resemblance; population = unsupported; name = unestablished in the image itself; formal breed = unsupported.

## Record V02 — Paul de Vos, *Un galgo blanco*

**Date:** 1636–1638.

**Artist:** Paul de Vos.

**Institution:** Museo Nacional del Prado.

**Context:** Torre de la Parada hunting/animal decorative programme associated with the Spanish royal collection.

**Prado object:** https://www.museodelprado.es/coleccion/obra-de-arte/un-galgo-blanco/65c9e49c-0c3a-48ee-b675-02924baac33d

The Prado explicitly catalogues the work as *Un galgo blanco*. This makes the record unusually valuable because the museum's object title gives a named galgo identity to the depicted dog within a seventeenth-century Spanish royal-hunting context.

### What it supports

- a dog identified by the Prado as a `galgo` appears in a seventeenth-century royal hunting decorative programme;
- the cultural and courtly importance of the galgo/greyhound type in early-modern Spain;
- strong evidence for name + visual type + elite hunting context in the object's modern scholarly cataloguing.

### What it does not support

- a direct pedigree from this individual/type to modern registered dogs;
- genetic purity or closed-breed continuity;
- the absence of regional or imported admixture in early-modern coursing dogs.

**Continuity dimensions:** function = strong contextual support; type = strong; population = unresolved; name = strong catalogue support; formal breed = not applicable to a pre-standardization period.

## Record V03 — early-modern hunting books and prints

**Date range:** 16th–18th centuries.

**Evidence class:** printed hunting treatises, engravings, illustrations and emblematic imagery held by BNE Digital and other European libraries.

This class should be ingested record-by-record rather than summarized as one visual tradition. For every image, GALGOS should capture publication metadata, page, plate title, labels attached to the dog and whether the image is generic, copied from an earlier print, or tied to a Spanish context.

### Research value

- terminology attached to dog types;
- depiction of leash, coursing and pack practices;
- human class/status around hunting;
- technology and equipment;
- changes in iconography over time.

### Main risk

Printed images were frequently copied across borders and decades. A dog illustrated in a Spanish-language book is not automatically evidence for a Spanish breeding population.

## Record V04 — nineteenth-century press, prints and photography

The nineteenth century offers a transition from fine-art iconography to more documentary visual culture. Priority sources include illustrated press, sporting publications, engravings and early photography.

This period is especially useful for comparing:

- aristocratic versus rural hunting imagery;
- breed/type vocabulary;
- organized competitions;
- imported British sporting influence;
- public fashion and ownership.

The research programme should distinguish a photograph of a named dog from a generic engraved `galgo`. Named-dog records can potentially be connected to pedigrees, owners, competitions and newspaper results.

## Record V05 — twentieth-century sport and canódromo imagery

**Evidence class:** race programmes, club photography, press photography, advertisements, federation documents, canódromo plans and film/newsreel footage.

This is where visual material can connect strongly to institutional history already covered in Batches 10–12.

Priority fields:

- venue;
- exact date;
- event type (field coursing vs track racing);
- dog name;
- owner/breeder;
- race or coursing result;
- source publication or archive;
- whether the dog is documented as Galgo Español, English Greyhound, cross, or uncertain.

## Record V06 — rescue, documentary and companion-animal visual culture, 1990s–2026

Contemporary photography and film have profoundly changed the public image of the galgo. The corpus already contains a dedicated canonical record for *Yo Galgo* (2018).

Visual evidence from rescue organizations, documentaries, campaigns and adoption networks can document changing social representation, but GALGOS must distinguish:

- documentary observation;
- campaign imagery;
- fundraising communication;
- journalistic photography;
- independently collected population data.

An emotionally powerful image is not automatically statistical evidence.

## Visual provenance schema

Every future visual record should expose:

- `visual_id`
- `title`
- `creator`
- `date_start` / `date_end`
- `object_type`
- `institution`
- `object_url`
- `image_url`
- `rights_status`
- `geography`
- `contemporary_label`
- `function_continuity`
- `type_continuity`
- `population_continuity`
- `name_continuity`
- `formal_breed_continuity`
- `evidence_level`
- `what_it_supports`
- `what_it_does_not_support`
- `notes`

## Site design rule

The interactive GALGOS Atlas should never place visual objects on a geographic map unless the object's location or geographic association is supported. A museum's present location should not be confused with an object's historical place of production or subject.

Visual grouping by century, function or evidence type is often safer than pinning objects to precise coordinates.

## Priority next acquisitions

1. High-resolution rights-cleared San Baudelio hunting-dog images with museum accession references.
2. Prado-approved/public-domain-compatible image source for *Un galgo blanco*.
3. BNE hunting-treatise plates explicitly labelled `galgo` or `lebrel`.
4. Nineteenth-century Hemeroteca illustrations tied to named competitions or dogs.
5. Early twentieth-century canódromo photographs and programmes.
6. Federation and club imagery tied to documented events.

## Research questions enabled by the atlas

- What is the earliest securely dated visual representation of a sighthound-type hunting dog in Iberia?
- When do images explicitly labelled `galgo` become common?
- How does the depicted social role move from elite hunting to organized sport, rural coursing, rescue and companionship?
- Which visual similarities are only morphological, and which can be connected to named populations or pedigrees?

## Source status

This v1 atlas establishes methodology and two high-value anchor records. It deliberately does not pretend that every visually similar dog in Iberian art is a Galgo Español. Additional records should be added only with object-level provenance.
