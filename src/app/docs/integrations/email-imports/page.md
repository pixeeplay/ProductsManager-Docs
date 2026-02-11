---
title: Import par Email
nextjs:
  metadata:
    title: Import par Email - Products Manager APP
    description: Fonctionnalite planifiee d'import automatique de catalogues fournisseurs par email.
---

L'import par email est une fonctionnalite planifiee qui permettra de recevoir automatiquement les catalogues fournisseurs par email et de les integrer dans le pipeline d'import existant. {% .lead %}

---

## Statut de la fonctionnalite

{% callout type="warning" title="Fonctionnalite planifiee" %}
L'import par email n'est pas encore implemente dans la version actuelle de Products Manager (v4.5.58). Cette page decrit l'architecture prevue et les specifications fonctionnelles.
{% /callout %}

---

## Concept

L'objectif est de permettre aux fournisseurs d'envoyer leurs catalogues (fichiers CSV, Excel) par email a une adresse dediee. Le systeme traiterait automatiquement ces emails pour :

1. **Recevoir** le catalogue en piece jointe
2. **Identifier** le fournisseur (par l'adresse email source)
3. **Valider** le fichier (format, taille, colonnes attendues)
4. **Creer** un job d'import automatiquement
5. **Notifier** l'administrateur du resultat

---

## Architecture prevue

### Composants

| Composant | Role |
|-----------|------|
| Recepteur email (IMAP/POP3) | Surveillance de la boite mail dediee |
| Parser de pieces jointes | Extraction et validation des fichiers |
| Moteur de matching | Identification du fournisseur |
| Service d'import | Integration avec le pipeline existant |
| Service de notification | Confirmation par email |

### Flux de traitement

```
Email entrant
  -> Celery Beat (polling IMAP)
  -> Extraction piece jointe
  -> Identification fournisseur (par email source)
  -> Validation du fichier
  -> Creation job d'import (API existante)
  -> Notification email (succes/echec)
```

---

## Configuration SMTP existante

L'application dispose deja d'une configuration email complete pour l'envoi de notifications. Le router `/api/v1/settings/email` gere la configuration SMTP :

### Variables d'environnement

| Variable | Description |
|----------|-------------|
| `SMTP_SERVER` | Serveur SMTP sortant |
| `SMTP_PORT` | Port SMTP (587 pour STARTTLS) |
| `SMTP_USERNAME` | Identifiant SMTP |
| `SMTP_PASSWORD` | Mot de passe SMTP |
| `SMTP_USE_TLS` | Activer TLS |
| `FROM_EMAIL` | Adresse d'expediteur |
| `FROM_NAME` | Nom d'affichage |
| `ADMIN_EMAILS` | Emails administrateurs |

### Endpoints de configuration

| Endpoint | Methode | Description |
|----------|---------|-------------|
| `/api/v1/settings/email` | GET | Configuration email actuelle |
| `/api/v1/settings/email` | PUT | Modifier la configuration |
| `/api/v1/settings/email/test` | POST | Envoyer un email de test |

---

## Service d'email existant

Le service `email_service.py` est deja utilise pour :

- **Alertes de securite** : Notifications de tentatives de connexion suspectes
- **Rapports periodiques** : Envoi de rapports automatises via Celery
- **Alertes de rate limit** : Notifications de depassement de limites
- **Confirmation d'import** : Notifications de fin de traitement

---

## Specifications prevues

### Identification du fournisseur

Le systeme utiliserait le champ `email` des configurations fournisseurs pour matcher l'expediteur :

```python
# Logique de matching prevue
async def identify_supplier(sender_email):
    # 1. Recherche exacte par email
    supplier = await find_supplier_by_email(sender_email)
    if supplier:
        return supplier

    # 2. Recherche par domaine
    domain = sender_email.split("@")[1]
    supplier = await find_supplier_by_domain(domain)
    if supplier:
        return supplier

    # 3. Fournisseur inconnu -> notification admin
    return None
```

### Validation des pieces jointes

| Critere | Valeur |
|---------|--------|
| Formats acceptes | `.csv`, `.xlsx`, `.xls` |
| Taille maximale | 50 Mo |
| Nombre max de pieces jointes | 1 par email |
| Colonnes requises | Depend du mapping template du fournisseur |

### Configuration par fournisseur

Chaque fournisseur pourrait avoir une configuration d'import email :

| Champ | Description |
|-------|-------------|
| `email_import_enabled` | Activer l'import email pour ce fournisseur |
| `allowed_sender_emails` | Liste des emails autorises |
| `default_mapping_template` | Template de mapping a utiliser |
| `auto_process` | Lancer le traitement automatiquement |
| `notify_on_success` | Notifier en cas de succes |
| `notify_on_failure` | Notifier en cas d'echec |

---

## Taches Celery prevues

| Tache | Frequence | Description |
|-------|-----------|-------------|
| `check_import_emails` | Toutes les 5 minutes | Verification de la boite mail |
| `process_email_import` | A la demande | Traitement d'un email d'import |
| `cleanup_processed_emails` | Quotidienne | Archivage des emails traites |

---

## Alternatives actuelles

En attendant l'implementation de l'import par email, les alternatives suivantes sont disponibles :

### Import manuel

Upload direct via l'interface web ou l'API :

```bash
curl -X POST /api/v1/imports/upload \
  -F "file=@catalogue.xlsx" \
  -F "supplier_id=uuid"
```

### Import planifie

Configuration de planifications automatiques via Celery Beat dans `/api/v1/import-configs`.

### Import via API

Integration directe via l'API REST pour les systemes automatises.

{% callout type="info" title="Contribution" %}
Si vous souhaitez contribuer a l'implementation de cette fonctionnalite, consultez la roadmap dans `/docs/releases/roadmap` pour les specifications detaillees.
{% /callout %}
