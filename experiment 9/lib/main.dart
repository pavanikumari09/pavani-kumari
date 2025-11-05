import 'package:flutter/material.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Create or open the database
  final database = openDatabase(
    join(await getDatabasesPath(), 'calculator_history.db'),
    onCreate: (db, version) {
      return db.execute(
        'CREATE TABLE history(id INTEGER PRIMARY KEY AUTOINCREMENT, expression TEXT, result TEXT)',
      );
    },
    version: 1,
  );

  runApp(CalculatorApp(database: database));
}

class CalculatorApp extends StatelessWidget {
  final Future<Database> database;
  const CalculatorApp({super.key, required this.database});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Calculator with History',
      theme: ThemeData(primarySwatch: Colors.teal),
      debugShowCheckedModeBanner: false,
      home: CalculatorScreen(database: database),
    );
  }
}

class CalculatorScreen extends StatefulWidget {
  final Future<Database> database;
  const CalculatorScreen({super.key, required this.database});

  @override
  State<CalculatorScreen> createState() => _CalculatorScreenState();
}

class _CalculatorScreenState extends State<CalculatorScreen> {
  String _output = "0";
  String _input = "";
  double num1 = 0;
  double num2 = 0;
  String operand = "";
  List<Map<String, dynamic>> _history = [];

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    final db = await widget.database;
    final List<Map<String, dynamic>> history = await db.query(
      'history',
      orderBy: 'id DESC',
    );
    setState(() {
      _history = history;
    });
  }

  Future<void> _insertHistory(String expression, String result) async {
    final db = await widget.database;
    await db.insert(
      'history',
      {'expression': expression, 'result': result},
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
    _loadHistory();
  }

  void buttonPressed(String buttonText) {
    if (buttonText == "C") {
      _input = "";
      num1 = 0;
      num2 = 0;
      operand = "";
    } else if (buttonText == "+" ||
        buttonText == "-" ||
        buttonText == "×" ||
        buttonText == "÷") {
      num1 = double.tryParse(_input) ?? 0;
      operand = buttonText;
      _input = "";
    } else if (buttonText == "=") {
      num2 = double.tryParse(_input) ?? 0;
      String result = "";
      if (operand == "+") {
        result = (num1 + num2).toString();
      } else if (operand == "-") {
        result = (num1 - num2).toString();
      } else if (operand == "×") {
        result = (num1 * num2).toString();
      } else if (operand == "÷") {
        result = num2 != 0 ? (num1 / num2).toString() : "Error";
      }

      String expression = "$num1 $operand $num2";
      _insertHistory(expression, result);

      _input = result;
      operand = "";
    } else {
      _input += buttonText;
    }

    setState(() {
      _output = _input;
    });
  }

  Widget buildButton(String buttonText) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.all(6),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.all(22),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          onPressed: () => buttonPressed(buttonText),
          child: Text(
            buttonText,
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Calculator with History'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: () async {
              final db = await widget.database;
              await db.delete('history');
              _loadHistory();
            },
          ),
        ],
      ),
      body: Column(
        children: <Widget>[
          Container(
            alignment: Alignment.centerRight,
            padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 12),
            child: Text(
              _output,
              style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold),
            ),
          ),
          const Divider(),
          Expanded(
            flex: 2,
            child: ListView.builder(
              reverse: true,
              itemCount: _history.length,
              itemBuilder: (context, index) {
                final entry = _history[index];
                return ListTile(
                  title: Text(entry['expression']),
                  subtitle: Text('= ${entry['result']}'),
                );
              },
            ),
          ),
          Column(
            children: [
              Row(children: [buildButton("7"), buildButton("8"), buildButton("9"), buildButton("÷")]),
              Row(children: [buildButton("4"), buildButton("5"), buildButton("6"), buildButton("×")]),
              Row(children: [buildButton("1"), buildButton("2"), buildButton("3"), buildButton("-")]),
              Row(children: [buildButton("."), buildButton("0"), buildButton("C"), buildButton("+")]),
              Row(children: [buildButton("=")]),
            ],
          ),
        ],
      ),
    );
  }
}
