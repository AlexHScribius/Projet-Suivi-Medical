export class Consultation{
    idConsultation: number;
	date: Date;
	effectuee: Boolean;
	annulee: Boolean;
	
	idMedecin: number;
	prenomMedecin: string;
	nomMedecin: string;
	
	idPatient: number;
	prenomPatient: string;
	nomPatient: string;
	idDossierPatient: number;
	
	idFacture: number;
	facturePayee: Boolean;

	constructor(){
	}

}