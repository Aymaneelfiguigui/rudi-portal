package org.rudi.microservice.projekt.storage.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.rudi.common.storage.entity.AbstractStampedEntity;
import org.rudi.microservice.projekt.core.common.SchemaConstants;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * Public cible
 */
@Entity
@Table(name = "target_audience", schema = SchemaConstants.DATA_SCHEMA)
@Getter
@Setter
@ToString
public class TargetAudienceEntity extends AbstractStampedEntity  {

	private static final long serialVersionUID = -8837224571760331803L;

	@Override
	public int hashCode() {
		return super.hashCode();
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (!(obj instanceof TargetAudienceEntity)) {
			return false;
		}
		return super.equals(obj);
	}
}
