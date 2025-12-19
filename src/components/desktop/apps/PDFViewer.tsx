import React from 'react';
import { FileText, Download, ZoomIn, ZoomOut, Printer } from 'lucide-react';

interface PDFViewerProps {
  fileName?: string;
}

export function PDFViewer({ fileName = "portfolio.pdf" }: PDFViewerProps) {
  return (
    <div className="flex flex-col h-full bg-[hsl(var(--secondary))]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-background/50">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium">{fileName}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs px-2">100%</span>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Printer className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto bg-background rounded-lg shadow-lg p-8 space-y-6 animate-fade-in">
          {/* Header */}
          <div className="text-center border-b border-border/50 pb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              John Doe
            </h1>
            <p className="text-lg text-muted-foreground mt-2">Creating my way to Data Science</p>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
              <span>📧 mail@dilippoudel.com.np</span>
              <span>📱 +977 9823444798</span>
              <span>📍 Dang, Nepal</span>
            </div>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm">
              <a href="#" className="text-primary hover:underline">🔗 linkedin.com/in/dilippou789</a>
              <a href="#" className="text-primary hover:underline">🐙 github.com/Dilip7672</a>
              <a href="#" className="text-primary hover:underline">🌐 dilippoudel.com.np</a>
            </div>
          </div>

          {/* Summary */}
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Professional Summary
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Passionate Full Stack Developer with 5+ years of experience building scalable web applications. 
              Proficient in React, Node.js, TypeScript, and cloud technologies. Strong problem-solving skills 
              with a focus on creating user-friendly, performant solutions. Open source contributor and 
              continuous learner committed to staying current with emerging technologies.Passionate Geospatial
              Data Science learner with a strong foundation in spatial analysis, data visualization, and 
              Python-based data processing. Experienced in working with GIS tools, remote sensing data,
              and geospatial libraries such as GeoPandas and QGIS. Driven by curiosity and problem-solving,
              with a focus on extracting meaningful insights from spatial data to support data-driven decision-making.
              Committed to continuous learning and staying updated with emerging geospatial and data science technologies.
            </p>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Technical Skills
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm mb-2">Python</h3>
                <div className="flex flex-wrap gap-2">
                  {['Pandas', 'Numpy', 'Geopanda', 'Geopandas'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-2">GIS</h3>
                <div className="flex flex-wrap gap-2">
                  {['QGIS', 'ArcGIS', 'OGIS'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-2">SQL</h3>
                <div className="flex flex-wrap gap-2">
                  {['Postgres', 'MySQL'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-orange-500/10 text-orange-500 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-2">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {['Git', 'VS Code',].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-purple-500/10 text-purple-500 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Experience */}
       <section>
  <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
    Experience & Learning Journey
  </h2>

  <div className="space-y-4">
    <div className="border-l-2 border-primary/30 pl-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">Geospatial Data Science Learner</h3>
          <p className="text-primary text-sm">Self-Directed Learning</p>
        </div>
        <span className="text-sm text-muted-foreground">2023 – Present</span>
      </div>
      <ul className="mt-2 text-sm text-muted-foreground space-y-1">
        <li>• Learning spatial data analysis using Python (GeoPandas, Shapely, Rasterio)</li>
        <li>• Working with GIS tools such as QGIS for mapping and spatial visualization</li>
        <li>• Exploring remote sensing datasets (Sentinel, Landsat) and raster processing</li>
        <li>• Building small projects involving spatial data cleaning, analysis, and mapping</li>
      </ul>
    </div>

    <div className="border-l-2 border-primary/30 pl-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">Python & Data Analysis Learner</h3>
          <p className="text-primary text-sm">Academic & Online Platforms</p>
        </div>
        <span className="text-sm text-muted-foreground">2022 – 2023</span>
      </div>
      <ul className="mt-2 text-sm text-muted-foreground space-y-1">
        <li>• Practiced data analysis using Pandas, NumPy, and Matplotlib</li>
        <li>• Applied basic statistical concepts to real-world datasets</li>
        <li>• Developed Jupyter Notebook workflows for data exploration</li>
      </ul>
    </div>

    <div className="border-l-2 border-primary/30 pl-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">Web & Visualization Foundations</h3>
          <p className="text-primary text-sm">Project-Based Learning</p>
        </div>
        <span className="text-sm text-muted-foreground">2021 – 2022</span>
      </div>
      <ul className="mt-2 text-sm text-muted-foreground space-y-1">
        <li>• Built interactive visualizations using JavaScript and web mapping libraries</li>
        <li>• Learned basics of Leaflet and Mapbox for geospatial web maps</li>
        <li>• Focused on clean UI and user-friendly data presentation</li>
      </ul>
    </div>
  </div>
</section>


          {/* Education */}
                 <section>
                      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                      Education
                      </h2>
        
                        <div className="border-l-2 border-primary/30 pl-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">Bachelor of Civil Engineering</h3>
                          <p className="text-primary text-sm">University / Engineering College</p>
                        </div>
                        <span className="text-sm text-muted-foreground">2021 – Present</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Relevant Coursework: Structural Analysis, Geotechnical Engineering, Transportation Engineering, Hydrology
                      </p>
                    </div>
            </section>


          {/* Projects */}
         <section>
  <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
    Notable Projects
  </h2>

  <div className="grid gap-3">
    <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
      <h3 className="font-semibold">🗺️ GIS-Based Land Use & Land Cover Analysis</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Performed land use and land cover classification using satellite imagery to analyze urban growth patterns.
        Utilized QGIS, remote sensing data (Sentinel/Landsat), and basic spatial analysis techniques.
      </p>
    </div>

    <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
      <h3 className="font-semibold">🌧️ Flood Susceptibility Mapping Using GIS</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Developed a flood susceptibility map by integrating terrain, drainage, rainfall, and land use data.
        Applied spatial overlay and weighted analysis to support disaster risk assessment.
      </p>
    </div>

    <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
      <h3 className="font-semibold">📊 Python-Based Spatial Data Analysis Project</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Analyzed geospatial datasets using Python libraries such as GeoPandas and Matplotlib.
        Created maps and visualizations to support civil engineering planning and decision-making.
      </p>
    </div>
  </div>
</section>


          {/* Footer */}
          <div className="text-center pt-4 border-t border-border/50 text-xs text-muted-foreground">
            <p>References available upon request</p>
            <p className="mt-1">Last updated: December 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
