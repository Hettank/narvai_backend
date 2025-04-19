import RojMed from "../models/RojMed.js";

export const getAll = async (req, res) => {
    try {
        const { date } = req.query;

        const query = {};
        
        if (date) {
            // Create start of the day (00:00:00)
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            
            // Create end of the day (23:59:59.999)
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            
            query.date = {
                $gte: startDate,
                $lte: endDate
            };
        }
        
        const rojmed = await RojMed.find(query);
        
        res.status(200).json({ rojmed });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// export const create = async (req, res) => {
//     try {
//         const { date, userId, expenseFromBelow, expenseFromAbove } = req.body;

//         // Check for existing with BOTH userId and date
//         const existing = await RojMed.findOne({ userId, date: new Date(date) });

//         if (existing) {
//             return res.status(400).json({ message: "Entry already exists for this user and date. Use update instead." });
//         }

//         const rojmed = await RojMed.create({
//             userId,
//             date: new Date(date),
//             expenseFromBelow,
//             expenseFromAbove,
//         });

//         return res.status(201).json({ data: rojmed, message: "Rojmed created successfully" });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// }

export const create = async (req, res) => {
    try {
        const { date, userId, expenseFromBelow, expenseFromAbove } = req.body;

        // Create date at start of day for consistency
        const entryDate = new Date(date);
        entryDate.setHours(0, 0, 0, 0);

        const existing = await RojMed.findOne({ userId, date: entryDate });

        if (existing) {
            return res.status(400).json({ message: "Entry already exists for this user and date. Use update instead." });
        }

        const rojmed = await RojMed.create({
            userId,
            date: entryDate,  // Use the normalized date
            expenseFromBelow,
            expenseFromAbove,
        });

        return res.status(201).json({ data: rojmed, message: "Rojmed created successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// export const update = async (req, res) => {
//     try {
//         const { date, userId, expenseFromBelow, expenseFromAbove } = req.body;
//         console.log("Request body:", req.body);

//         const query = {};
        
//         if (date) {
//             // Create start of the day (00:00:00)
//             const startDate = new Date(date);
//             startDate.setHours(0, 0, 0, 0);
            
//             // Create end of the day (23:59:59.999)
//             const endDate = new Date(date);
//             endDate.setHours(23, 59, 59, 999);
            
//             query.date = {
//                 $gte: startDate,
//                 $lte: endDate
//             };
//         }

//         if (userId) query.userId = userId;

//         // Log the exact query being sent to MongoDB
//         console.log("MongoDB query:", JSON.stringify(query));

//         // Find the document to update
//         const existingRojmed = await RojMed.findOne(query);
//         console.log("Found document:", existingRojmed ? "Yes" : "No");

//         if (!existingRojmed) {
//             // Try to find any documents for this user
//             const allUserDocs = await RojMed.find({ userId }).limit(5);
//             console.log("All docs for this user:", allUserDocs);
            
//             return res.status(404).json({ message: "No entry found for this date. Create one first." });
//         }

//         // Rest of the code...
//     } catch (error) {
//         console.error("Error in update:", error);
//         res.status(400).json({ message: error.message });
//     }
// }


export const update = async (req, res) => {
    try {
      const { _id, date, userId, expenseFromBelow, expenseFromAbove } = req.body;
      console.log("Update request body:", req.body);
  
      let existingRojmed;
  
      // If _id is provided, use it for lookup (most reliable)
      if (_id) {
        existingRojmed = await RojMed.findById(_id);
        console.log("Looking up by _id:", _id, "Found:", !!existingRojmed);
      } 
      // Fallback to date+userId lookup if no _id
      else if (date && userId) {
        // Create query for date range
        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0);
        
        existingRojmed = await RojMed.findOne({
          userId,
          date: {
            $gte: queryDate,
            $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000)
          }
        });
        console.log("Looking up by date+userId:", date, userId, "Found:", !!existingRojmed);
      }
  
      if (!existingRojmed) {
        return res.status(404).json({ message: "No entry found. Create one first." });
      }
  
      // Update the document with new values
      if (expenseFromBelow !== undefined) {
        existingRojmed.expenseFromBelow = expenseFromBelow;
      }
      
      if (expenseFromAbove !== undefined) {
        existingRojmed.expenseFromAbove = expenseFromAbove;
      }
      
      // Save the updated document
      await existingRojmed.save();
      
      return res.status(200).json({ 
        data: existingRojmed, 
        message: "Rojmed updated successfully" 
      });
    } catch (error) {
      console.error("Error in update:", error);
      res.status(400).json({ message: error.message });
    }
  };