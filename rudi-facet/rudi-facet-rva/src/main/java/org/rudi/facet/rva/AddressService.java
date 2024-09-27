package org.rudi.facet.rva;

import java.util.List;

import org.rudi.common.service.exception.AppServiceBadRequestException;
import org.rudi.facet.rva.exception.ExternalApiRvaException;
import org.rudi.facet.rva.exception.TooManyAddressesException;
import org.rudi.rva.core.bean.Address;
import org.rudi.rva.core.bean.AddressKind;

public interface AddressService {
	/**
	 * Retourne la liste des voies et adresses en fonction d'un mot clé.
	 *
	 * @param query mot clé de la recherche
	 * @return Liste des voies et adresses ou liste vide si l'API ne renvoie rien
	 * @throws ExternalApiRvaException       lorsque l'erreur vient de l'API RVA de RM
	 * @throws AppServiceBadRequestException lorsque la taille du mot clé de la recherche < 4
	 */
	List<Address> searchAddresses(String query, AddressKind kind, Integer limit)
			throws ExternalApiRvaException, AppServiceBadRequestException, TooManyAddressesException;

	Address getAddressById(String idAddress) throws ExternalApiRvaException, TooManyAddressesException;
}
