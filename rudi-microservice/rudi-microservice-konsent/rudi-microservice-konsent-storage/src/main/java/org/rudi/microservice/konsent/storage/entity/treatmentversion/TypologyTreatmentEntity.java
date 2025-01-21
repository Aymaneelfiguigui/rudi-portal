package org.rudi.microservice.konsent.storage.entity.treatmentversion;

import jakarta.persistence.AssociationOverride;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Table;
import org.rudi.microservice.konsent.core.common.SchemaConstants;
import org.rudi.microservice.konsent.storage.entity.common.AbstractMultilangualStampedEntity;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "typology_treatment", schema = SchemaConstants.DATA_SCHEMA)
@Getter
@Setter
@AssociationOverride(name = "labels", joinTable = @JoinTable(name = "typology_treatment_dictionary_entry", joinColumns = @JoinColumn(name = "typology_treatment_fk"), inverseJoinColumns = @JoinColumn(name = "dictionary_entry_fk")))
public class TypologyTreatmentEntity extends AbstractMultilangualStampedEntity {
	private static final long serialVersionUID = 4471519721998137595L;

}
