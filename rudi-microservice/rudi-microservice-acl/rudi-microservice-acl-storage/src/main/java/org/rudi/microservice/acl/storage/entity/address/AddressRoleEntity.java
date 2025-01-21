package org.rudi.microservice.acl.storage.entity.address;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import org.rudi.common.storage.entity.AbstractStampedEntity;
import org.rudi.microservice.acl.core.common.SchemaConstants;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "address_role", schema = SchemaConstants.DATA_SCHEMA)
@Getter
@Setter
@ToString
public class AddressRoleEntity extends AbstractStampedEntity {

	private static final long serialVersionUID = 911619997745516430L;

	@Column(name = "type", nullable = false)
	@Enumerated(EnumType.STRING)
	private AddressType type;

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = super.hashCode();
		result = prime * result + ((getType() == null) ? 0 : getType().hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (!super.equals(obj)) {
			return false;
		}
		if (!(obj instanceof AddressRoleEntity)) {
			return false;
		}
		AddressRoleEntity other = (AddressRoleEntity) obj;
		return getType() == other.getType();
	}

}
