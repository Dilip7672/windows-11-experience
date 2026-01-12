import React, { useState } from 'react';
import { FileText, Download, ZoomIn, ZoomOut, Printer, ChevronLeft, ChevronRight } from 'lucide-react';

interface PDFViewerProps {
  fileName?: string;
  pdfType?: 'portfolio' | 'ecommerce' | 'pandas';
}

export function PDFViewer({ fileName = "portfolio.pdf", pdfType = "portfolio" }: PDFViewerProps) {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  const handleDownload = () => {
    let pdfPath = '';
    let downloadName = fileName;
    
    if (pdfType === 'ecommerce') {
      pdfPath = '/documents/ecommerceanalysis.pdf';
      downloadName = 'ecommerceanalysis.pdf';
    } else if (pdfType === 'pandas') {
      pdfPath = '/documents/pandasimportants.pdf';
      downloadName = 'pandasimportants.pdf';
    } else {
      // For portfolio, create a downloadable version from the content
      handlePortfolioDownload();
      return;
    }

    // Create download link
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = downloadName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePortfolioDownload = () => {
    // Create a printable version that can be saved as PDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Dilip Poudel - Portfolio</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; }
          h1 { color: #2563eb; text-align: center; }
          h2 { color: #1e40af; border-bottom: 2px solid #2563eb; padding-bottom: 5px; margin-top: 30px; }
          .contact { text-align: center; color: #666; margin-bottom: 30px; }
          .skill { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 4px 12px; border-radius: 20px; margin: 2px; font-size: 12px; }
          .section { margin-bottom: 20px; }
          .job { border-left: 3px solid #2563eb; padding-left: 15px; margin-bottom: 15px; }
          .job h3 { margin: 0; }
          .job .date { color: #666; font-size: 14px; }
          ul { margin: 5px 0; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>Dilip Poudel</h1>
        <p style="text-align: center; color: #666;">Creating my way to Data Science</p>
        <div class="contact">
          📧 mail@dilippoudel.com.np | 📱 +977 9823444798 | 📍 Dang, Nepal
        </div>
        
        <h2>Professional Summary</h2>
        <p>Passionate Geospatial Data Science learner with a strong foundation in spatial analysis, data visualization, and Python-based data processing. Experienced in working with GIS tools, remote sensing data, and geospatial libraries such as GeoPandas and QGIS.</p>
        
        <h2>Technical Skills</h2>
        <p>
          <span class="skill">Pandas</span>
          <span class="skill">Numpy</span>
          <span class="skill">GeoPandas</span>
          <span class="skill">QGIS</span>
          <span class="skill">ArcGIS</span>
          <span class="skill">PostgreSQL</span>
          <span class="skill">MySQL</span>
          <span class="skill">Git</span>
          <span class="skill">VS Code</span>
        </p>
        
        <h2>Experience & Learning Journey</h2>
        <div class="job">
          <h3>Geospatial Data Science Learner</h3>
          <p class="date">Self-Directed Learning | 2023 – Present</p>
          <ul>
            <li>Learning spatial data analysis using Python (GeoPandas, Shapely, Rasterio)</li>
            <li>Working with GIS tools such as QGIS for mapping and spatial visualization</li>
            <li>Exploring remote sensing datasets (Sentinel, Landsat) and raster processing</li>
          </ul>
        </div>
        
        <h2>Education</h2>
        <div class="job">
          <h3>Bachelor of Civil Engineering</h3>
          <p class="date">Rapti Engineering College | 2022 – Present</p>
        </div>
        
        <h2>Projects</h2>
        <ul>
          <li><strong>GIS-Based Land Use & Land Cover Analysis</strong> - Satellite imagery classification for urban growth analysis</li>
          <li><strong>Flood Susceptibility Mapping Using GIS</strong> - Disaster risk assessment using spatial overlay</li>
          <li><strong>Python-Based Spatial Data Analysis</strong> - GeoPandas and Matplotlib visualizations</li>
        </ul>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // For external PDFs (ecommerce and pandas)
  if (pdfType === 'ecommerce' || pdfType === 'pandas') {
    const pdfPath = pdfType === 'ecommerce' 
      ? '/documents/ecommerceanalysis.pdf' 
      : '/documents/pandasimportants.pdf';
    
    return (
      <div className="flex flex-col h-full bg-[hsl(var(--secondary))]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-background/50">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium">{fileName}</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleZoomOut}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs px-2 min-w-[40px] text-center">{zoom}%</span>
            <button 
              onClick={handleZoomIn}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Display PDF content as embedded object instead of iframe */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[hsl(var(--muted))]">
          <div 
            className="bg-background rounded-lg shadow-lg p-8 max-w-2xl w-full"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <div className="text-center space-y-4">
              <FileText className="w-16 h-16 text-red-500 mx-auto" />
              <h3 className="text-lg font-semibold">{fileName}</h3>
              <p className="text-sm text-muted-foreground">
                Click the download button to view this PDF in your default PDF viewer.
              </p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Portfolio PDF (inline content)
  return (
    <div className="flex flex-col h-full bg-[hsl(var(--secondary))]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-background/50">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium">{fileName}</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleZoomOut}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs px-2 min-w-[40px] text-center">{zoom}%</span>
          <button 
            onClick={handleZoomIn}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Printer className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto p-6">
        <div 
          className="max-w-2xl mx-auto bg-background rounded-lg shadow-lg p-8 space-y-6 animate-fade-in transition-transform"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          {/* Header */}
          <div className="text-center border-b border-border/50 pb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Dilip Poudel
            </h1>
            <p className="text-lg text-muted-foreground mt-2">Creating my way to Data Science</p>
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground flex-wrap">
              <span>📧 mail@dilippoudel.com.np</span>
              <span>📱 +977 9823444798</span>
              <span>📍 Dang, Nepal</span>
            </div>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm flex-wrap">
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
              Passionate Geospatial Data Science learner with a strong foundation in spatial analysis, data visualization, and 
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
                  {['Pandas', 'Numpy', 'GeoPandas'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-2">GIS</h3>
                <div className="flex flex-wrap gap-2">
                  {['QGIS', 'ArcGIS'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-2">SQL</h3>
                <div className="flex flex-wrap gap-2">
                  {['PostgreSQL', 'MySQL'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-orange-500/10 text-orange-500 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm mb-2">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {['Git', 'VS Code'].map(skill => (
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
                <div className="flex items-start justify-between flex-wrap gap-2">
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
                </ul>
              </div>

              <div className="border-l-2 border-primary/30 pl-4">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-semibold">Python & Data Analysis Learner</h3>
                    <p className="text-primary text-sm">Academic & Online Platforms</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2022 – 2023</span>
                </div>
                <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                  <li>• Practiced data analysis using Pandas, NumPy, and Matplotlib</li>
                  <li>• Applied basic statistical concepts to real-world datasets</li>
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
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-semibold">Bachelor of Civil Engineering</h3>
                  <p className="text-primary text-sm">Rapti Engineering College</p>
                </div>
                <span className="text-sm text-muted-foreground">2022 – Present</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Relevant Coursework: Structural Analysis, Geotechnical Engineering, Transportation Engineering
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
                  Performed land use classification using satellite imagery to analyze urban growth patterns.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                <h3 className="font-semibold">🌧️ Flood Susceptibility Mapping Using GIS</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Developed a flood susceptibility map for disaster risk assessment.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                <h3 className="font-semibold">📊 Python-Based Spatial Data Analysis</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Analyzed geospatial datasets using GeoPandas and Matplotlib.
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