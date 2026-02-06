package uk.ac.rhul.cs.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

import uk.ac.rhul.cs.services.AnalysisService;
import uk.ac.rhul.cs.dto.DeveloperReportDTO;

import uk.ac.rhul.cs.models.Project;
import uk.ac.rhul.cs.repositories.ProjectRepository;

@RestController
@RequestMapping("/gemini/")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalysisController {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @GetMapping("/analyze/{owner}/{projectName}")
    public List<DeveloperReportDTO> triggerAnalysis(
		    @PathVariable String owner,
		    @PathVariable String projectName) {
	
	Project project = projectRepository.findByOwnerAndRepository(owner, projectName);

        return analysisService.generateProjectReport(project.getId().longValue());
    }
}
