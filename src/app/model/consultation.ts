export class Consultation{
    private idConsultation: number;
	private date: Date;
	private effectuee: Boolean;
	private annulee: Boolean;
	
	private idMedecin: number;
	private prenomMedecin: string;
	private nomMedecin: string;
	
	private idPatient: number;
	private prenomPatient: string;
	private nomPatient: string;
	private idDossierPatient: number;
	
	private idFacture: number;
	private facturePayee: Boolean;

	constructor(idConsultation,date,effectuee,annulee,idMedecin,prenomMedecin,
		nomMedecin,idPatient,prenomPatient,nomPatient,idDossierPatient,idFacture,facturePayee){
		this.idConsultation = idConsultation;
		this.date = date;
		this.effectuee = effectuee;
		this.annulee = annulee;
		this.idMedecin = idMedecin;
		this.prenomMedecin = prenomMedecin;
		this.nomMedecin = nomMedecin;
		this.idPatient = idPatient;
		this.prenomPatient = prenomPatient;
		this.nomPatient = nomPatient;
		this.idDossierPatient = idDossierPatient;
		this.idFacture = idFacture;
		this.facturePayee = facturePayee;
	}

}