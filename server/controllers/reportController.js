const { sendEmail } = require('../services/emailService');

const sendReport = async (req, res, next) => {
  try {
    const { email, reportData } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email address is required." });
    }
    
    // Construct HTML content from reportData
    // We expect reportData to contain necessary metrics
    
    const htmlContent = `
      <h1>Drone First Responder ROI Analysis Report</h1>
      <p>Thank you for using the DFR ROI Simulator. Here is your analysis based on your inputs.</p>
      
      <h2>Coverage Analysis</h2>
      <ul>
        <li><strong>Location:</strong> ${reportData.locationName || 'N/A'}</li>
        <li><strong>Coverage Radius:</strong> ${reportData.radius || 0} km</li>
        <li><strong>Coverage Area:</strong> ${reportData.coverageArea || 0} sq km</li>
      </ul>

      <h2>Response Time</h2>
      <ul>
        <li><strong>Drone Response:</strong> ${reportData.droneResponseMin || 0} min</li>
        <li><strong>Patrol Response:</strong> ${reportData.patrolResponseMin || 0} min</li>
        <li><strong>First Arrival:</strong> ${reportData.firstArrival || 'N/A'}</li>
      </ul>

      <h2>Call Simulation</h2>
      <ul>
        <li><strong>Annual Calls:</strong> ${reportData.annualCalls || 0}</li>
        <li><strong>Drone First Share:</strong> ${reportData.droneFirstShare || 0}%</li>
      </ul>

      <h2>ROI Summary (5-Year)</h2>
      <ul>
        <li><strong>Drone Program Cost:</strong> $${(reportData.roi5YearCost || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</li>
        <li><strong>Patrol Savings:</strong> $${(reportData.roi5YearSavings || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</li>
        <li><strong>Net Benefit:</strong> $${(reportData.roi5YearBenefit || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</li>
        <li><strong>ROI:</strong> ${reportData.roi5YearPercent ? reportData.roi5YearPercent.toFixed(2) : 0}%</li>
      </ul>

      <p><em>Note: This is a planning estimate. Assumptions should be verified with vendors and department data.</em></p>
    `;

    const success = await sendEmail({
      to: email,
      subject: "Your DFR ROI Analysis Report",
      html: htmlContent
    });

    if (success) {
      res.json({ message: "Report emailed successfully." });
    } else {
      res.status(500).json({ error: "Email service not configured on server." });
    }

  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendReport
};
