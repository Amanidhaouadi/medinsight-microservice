# Architecture du Réseau (Topologie) (le 24/12/2025)

## 1. Organisations
Nous créerons 3 Organisations distinctes pour respecter la décentralisation :
DoctorOrg (Médecins) : Gère les dossiers et crée les ordonnances.
PharmacyOrg (Pharmaciens) : Lit les ordonnances et délivre les médicaments.
PatientOrg (Patients) : Gère ses consentements et accède à ses données.

## 2. Canaux (Channels)
Les canaux permettent d'isoler les données. Nous en créerons 3 :
### consent-channel :
 - But : Gérer qui a le droit de voir quoi.
 - Membres : PatientOrg, DoctorOrg.
### records-channel (Dossiers) :
 - But : Stocker les hachages/données des dossiers médicaux.
 - Membres : DoctorOrg, PatientOrg.
### prescription-channel (Ordonnances) :
 - But : Transmettre les ordonnances du médecin au pharmacien.
 - Membres : DoctorOrg, PharmacyOrg, PatientOrg.

# Contenue du depo : 

## 1. Configuration du Réseau Fabric
### Dossier fabric-network contenant :
 - crypto-config.yaml : Génération des identités (certificats) pour les 3 organisations.
 - configtx.yaml : Configuration du bloc Genesis et des 3 canaux.
 - docker-compose-fabric.yaml : Pour lancer les nœuds (Peers, Orderer, CA).

## 2. Chaincode (Smart Contracts)
 - consent-cc : Fonctions donnerConsentement, verifierConsentement.
 - record-cc : Fonctions creerDossier, lireDossier, partagerDossier.
 - prescription-cc : Fonctions creerOrdonnance, lireOrdonnance.

## 3. Intégration Applicative
Ajout de (le 25/12/2025):
 - FabricService.java : Ce service gère la connexion au réseau et les appels aux Smart Contracts (Consentement, Dossier, Ordonnance).
 - pom.xml : Dépendance fabric-gateway ajoutée.
 - connection-profile.yaml : Configuration du réseau ajoutée.
