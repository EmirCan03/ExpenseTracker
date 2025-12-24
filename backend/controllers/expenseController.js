const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// ADD EXPENSE
exports.addExpense = async (req, res) => {
  try {
    const { icon, category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = await Expense.create({
      user: req.user._id,          // ✅ DOĞRU ALAN
      icon,
      category,                    // ✅ STRING
      amount: Number(amount),      // ✅ NUMBER
      date: new Date(date),
    });

    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET ALL EXPENSES
exports.getAllExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE EXPENSE
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// DOWNLOAD EXCEL
exports.downloadExpenseExcel = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({
      date: -1,
    });

    const data = expenses.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    const filePath = "expense_details.xlsx";
    xlsx.writeFile(wb, filePath);

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
