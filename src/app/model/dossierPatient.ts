export class DossierPatient{
    idDossierPatient: number;

	listeIdConsultation: number[];
	listeDateConsultation: Date[];
	
	idPatient: number;
	prenomPatient: string;
	nomPatient: string;
	
	listeIdMaladie: number[];
	listeNomMaladie: string[];
	listeDateDebutMaladie: Date[];
	listeDateFinMaladie: Date[];
	listeTraitementEffectueMaladie: string[]
	listeInformationsSupplementairesMaladie: string[];
}