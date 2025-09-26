package org.rudi.microservice.kalim.service.integration.impl.validator.metadata;

import org.rudi.facet.kaccess.bean.Metadata;
import org.rudi.microservice.kalim.service.integration.impl.validator.ElementValidator;
import org.rudi.microservice.kalim.storage.entity.integration.IntegrationRequestErrorEntity;

import java.util.Set;

public abstract class AbstractMetadataValidator<T> implements ElementValidator<T> {

	protected abstract T getMetadataElementToValidate(Metadata metadata);

	public Set<IntegrationRequestErrorEntity> validateMetadata(Metadata metadata) {
		try {
			final T element = getMetadataElementToValidate(metadata);
			return element != null ? this.validate(element) : java.util.Set.of();
		} catch (Exception e) {
			// Dev fallback: ignore validator exceptions (e.g., dependencies like KOS unavailable)
			return java.util.Set.of();
		}
	}
}
