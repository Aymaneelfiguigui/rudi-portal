package org.rudi.microservice.kalim.service.scheduler.apigateway;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.rudi.microservice.kalim.service.admin.AdminService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Periodically ensures that APIs are created in the API Gateway for all known datasets
 * (backfills routes for existing datasets and keeps new ones in sync),
 * so front-end download URLs start working automatically.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ApiBackfillScheduler {

    private final AdminService adminService;

    @Value("${rudi.kalim.create-missing-apis.enabled:false}")
    private boolean enabled;

    @Value("${rudi.kalim.create-missing-apis.delay:60000}")
    private long delayMs;

    /**
     * Runs with a fixed delay configured by rudi.kalim.create-missing-apis.delay (default 60s).
     * No-op unless rudi.kalim.create-missing-apis.enabled=true.
     */
    @Scheduled(fixedDelayString = "${rudi.kalim.create-missing-apis.delay:60000}")
    public void backfillApis() {
        if (!enabled) {
            return;
        }
        try {
            log.info("[Kalim] API backfill tick (delay={}ms)", delayMs);
            // null means: process all datasets
            adminService.createMissingApis(null);
        } catch (Exception e) {
            log.warn("[Kalim] API backfill failed", e);
        }
    }

    @jakarta.annotation.PostConstruct
    void logConfig() {
        log.info("[Kalim] API backfill enabled={} delay={}ms", enabled, delayMs);
    }
}
