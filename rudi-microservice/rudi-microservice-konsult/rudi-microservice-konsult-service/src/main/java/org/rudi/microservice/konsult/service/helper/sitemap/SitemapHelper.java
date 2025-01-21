/**
 * RUDI Portail
 */
package org.rudi.microservice.konsult.service.helper.sitemap;

import static org.rudi.microservice.konsult.service.constant.BeanIds.SITEMAP_DATA_CACHE;
import static org.rudi.microservice.konsult.service.constant.BeanIds.SITEMAP_RESOURCES_CACHE;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.commons.collections4.ListUtils;
import org.ehcache.Cache;
import org.rudi.common.core.DocumentContent;
import org.rudi.common.core.resources.ResourcesHelper;
import org.rudi.common.service.exception.AppServiceException;
import org.rudi.microservice.konsult.core.sitemap.SitemapDescriptionData;
import org.rudi.microservice.konsult.core.sitemap.SitemapEntryData;
import org.rudi.microservice.konsult.service.sitemap.AbstractUrlListComputer;
import org.sitemaps.schemas.sitemap.TUrl;
import org.sitemaps.schemas.sitemap.Urlset;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.Marshaller;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * @author FNI18300
 */
@Component
@Slf4j
public class SitemapHelper extends ResourcesHelper {

	public static final String SITEMAP_RESOURCE_KEY = "sitemap";

	private static final String CACHE_SITEMAP_DATA_KEY = "sitemap-data";

	@Getter
	@Value("${sitemap.generated.filename:sitemap.xml}")
	private String sitemapGeneratedFilename;

	@Getter(AccessLevel.PUBLIC)
	@Value("${sitemap.base-package:sitemap}")
	private String basePackage;

	@Getter(AccessLevel.PUBLIC)
	@Value("${sitemap.base-directory:}")
	private String baseDirectory;

	@Getter(AccessLevel.PROTECTED)
	private final Cache<String, DocumentContent> cache;

	private final Cache<String, SitemapDescriptionData> sitemapCache;

	@Value("${sitemap.config.filename:sitemap.json}")
	private String sitemapConfigFilename;

	private final ObjectMapper objectMapper;

	private final List<AbstractUrlListComputer> urlListComputers;

	SitemapHelper(@Qualifier(SITEMAP_RESOURCES_CACHE) Cache<String, DocumentContent> cache,
			@Qualifier(SITEMAP_DATA_CACHE) Cache<String, SitemapDescriptionData> sitemapCache,
			ObjectMapper objectMapper, List<AbstractUrlListComputer> urlListComputers) {
		this.cache = cache;
		this.sitemapCache = sitemapCache;
		this.objectMapper = objectMapper;
		this.urlListComputers = urlListComputers;
		fillResourceMapping(sitemapGeneratedFilename, SITEMAP_RESOURCE_KEY);
	}

	protected SitemapDescriptionData loadSitemapDescription() throws IOException {
		SitemapDescriptionData result;
		File f = new File(baseDirectory, sitemapConfigFilename);
		if (f.exists() && f.isFile()) {
			try (JsonParser p = objectMapper.createParser(f)) {
				result = p.readValueAs(SitemapDescriptionData.class);
			}
		} else {
			try (JsonParser p = objectMapper.createParser(Thread.currentThread().getContextClassLoader()
					.getResourceAsStream(basePackage + "/" + sitemapConfigFilename))) {
				result = p.readValueAs(SitemapDescriptionData.class);
			}
		}
		return result;
	}

	public SitemapDescriptionData getSitemapDescriptionData() {
		if (!sitemapCache.containsKey(CACHE_SITEMAP_DATA_KEY)) {
			try {
				sitemapCache.put(CACHE_SITEMAP_DATA_KEY, loadSitemapDescription());
			} catch (Exception e) {
				log.error("Failed to load sitemap", e);
			}
		}
		return sitemapCache.get(CACHE_SITEMAP_DATA_KEY);
	}

	public Urlset buildUrlset(SitemapDescriptionData sitemapDescriptionData) {
		Urlset urlset = new Urlset();
		List<TUrl> globalList = new ArrayList<>();

		for (SitemapEntryData sitemapEntryData : ListUtils.union(
				Collections.singletonList(sitemapDescriptionData.getStaticSitemapEntries()),
				sitemapDescriptionData.getSitemapEntries())) {
			// Parcours de la liste des KeyFigureComputer pour trouver celui qui correspond au KeyFigure
			for (AbstractUrlListComputer computer : urlListComputers) {
				try {
					List<TUrl> urlList = computer.compute(sitemapEntryData, sitemapDescriptionData);
					globalList.addAll(urlList);
				} catch (AppServiceException e) {
					log.error("Erreur lors de la construction de la liste d'URL de type {}", sitemapEntryData.getType(),
							e);
				}
			}
		}
		globalList = SitemapUtils.limitList(globalList, sitemapDescriptionData.getMaxUrlCount());
		urlset.getUrl().addAll(globalList);
		return urlset;
	}

	public void storeSitemapFile(Urlset urlset) throws AppServiceException {
		String dir = getBaseDirectory();
		String filename = getSitemapGeneratedFilename();
		try {
			File f = new File(dir, filename);
			JAXBContext context = JAXBContext.newInstance(Urlset.class);
			Marshaller mar = context.createMarshaller();
			mar.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
			f.getParentFile().mkdirs();
			mar.marshal(urlset, f);
			log.info("Sitemap généré dans {}", f.getAbsolutePath());

			// forcer la mise à jour du cache après regénération
			getCache().clear();
		} catch (Exception e) {
			throw new AppServiceException(
					String.format("Erreur lors de la generation du fichier de sitemap %s dans %s", filename, dir), e);
		}
	}

}
