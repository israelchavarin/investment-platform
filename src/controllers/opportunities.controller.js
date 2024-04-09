import Opportunity from '../database/models/opportunity.js';

/** Create opportunity function
 * Input: opportunityReference, investmentGoal, limitToInvestPerUser
 * Data output: newOpportunity
 */
export const createOpportunity = async (req, res) => {
  try {
    // Data gathering
    const {
      opportunityReference, investmentGoal, limitToInvestPerTransaction,
    } = req.body;

    // Reference verification
    const existingReference = await Opportunity.findOne(
      { where: { opportunity_reference: opportunityReference, is_hidden: false } },
    );

    if (existingReference) {
      return res.status(400).json({
        status: 400,
        error: 'Reference provided already in use',
      });
    }

    // Creation of opportunity
    const newOpportunity = await Opportunity.create({
      opportunity_reference: opportunityReference,
      investment_goal: investmentGoal,
      limit_to_invest_per_transaction: limitToInvestPerTransaction,
    });

    return res.status(201).json({
      status: 201,
      message: 'Opportunity created successfully',
      data: { newOpportunity },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

/** List all opportunities function
 * Input: none
 * Data output: [opportunities]
 */
export const listAllOpportunities = async (_, res) => {
  try {
    const opportunities = await Opportunity.findAll({ where: { is_hidden: false } });
    return res.status(200).json({
      status: 200,
      data: { opportunities },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

/** List active opportunities function
 * Input: none
 * Data output: [opportunities]
 */
export const listActiveOpportunities = async (_, res) => {
  try {
    const opportunities = await Opportunity.findAll(
      { where: { status: 'active', is_hidden: false } },
    );
    return res.status(200).json({
      status: 200,
      data: { opportunities },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};
