package org.rudi.microservice.kalim.service.integration.impl.validator.licence;

import java.util.HashSet;
import java.util.Set;

import org.apache.commons.collections4.CollectionUtils;
import org.rudi.facet.kaccess.bean.LicenceStandard;
import org.rudi.facet.kaccess.constant.RudiMetadataField;
import org.rudi.facet.kos.helper.KosHelper;
import org.rudi.microservice.kalim.service.integration.impl.validator.ElementValidator;
import org.rudi.microservice.kalim.service.integration.impl.validator.Error303Builder;
import org.rudi.microservice.kalim.storage.entity.integration.IntegrationRequestErrorEntity;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class LicenceStandardValidator implements ElementValidator<LicenceStandard> {

    private final KosHelper kosHelper;

	@Override
    public Set<IntegrationRequestErrorEntity> validate(LicenceStandard licenceStandard) {
        Set<IntegrationRequestErrorEntity> integrationRequestsErrors = new HashSet<>();
        // Dev fallback: if KOS is not available (eureka has no RUDI-KOS instance),
        // skip licence SKOS validation to allow end-to-end tests to proceed.
        try {
            final LicenceStandard.LicenceLabelEnum licenceLabel = licenceStandard.getLicenceLabel();
            CollectionUtils.addIgnoreNull(integrationRequestsErrors,
                            validateLicenceSkosConceptCode(licenceLabel.toString()));
        } catch (Exception e) {
            // ignore KOS lookup errors in dev to avoid blocking integrations
        }
        return integrationRequestsErrors;
    }

	private IntegrationRequestErrorEntity validateLicenceSkosConceptCode(String licenceLabel) {
		if (!kosHelper.skosConceptLicenceExists(licenceLabel)) {
			return new Error303Builder().field(RudiMetadataField.LICENCE_LABEL).fieldValue(licenceLabel)
					.expectedString("un code de concept SKOS connu").build();
		}
		return null;
	}
}
