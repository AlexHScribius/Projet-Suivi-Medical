export class Facture{
    idFacture: number;
	montant: number;
	payee: Boolean;

	idConsultation: number;
	dateConsultation: Date;
	
	idPatient: number;
	nomPatient: string;
	prenomPatient: string;
	
	idDossierPatient: number;
	
	idMedecin: number;
	nomMedecin: string;
	prenomMedecin: string;
}