import { pool } from '#config';
import { sendMsg } from '#utils';

const apply = async (req, res, next) => {
  try {
    const { amount, term, rate, total_due } = req.body;

    if (!amount || !term || !rate || !total_due) {
      return res.status(400).json({ err: 'Missing field' });
    }
    
    const userId = req.user.id;

    const q = `
      WITH
        user_has_loan AS (
          SELECT 1
          FROM loans
          WHERE user_id = $1 AND status != 'done'
          LIMIT 1
        ),

        bucket_ok AS (
          UPDATE bucket
          SET amount = amount - $2
          WHERE
            NOT EXISTS (SELECT 1 from user_has_loan)
            AND amount >= $2
          RETURNING id
        )
        
      INSERT INTO loans (user_id, amount, term, rate, total_due, due_date)
      SELECT
        $1, $2, $3, $4, $5,
        NOW() + make_interval(days => $6)
      WHERE
        EXISTS (SELECT 1 FROM bucket_ok)
      RETURNING id
    `;

    const r = await pool.query(q, [
      userId,
      amount,
      term,
      rate,
      total_due,
      term
    ]);

    if (r.rows.length === 0) {
      return res.status(400).json({ err: 'loan not approved' });
    }

    res.status(201).json({msg: 'application sent'});
    await sendMsg(userId, 'Your loan application has been received. Kindly wait for approval.');
  } catch (err) {
    next(err);
  }
};

export default apply;
