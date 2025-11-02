import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Registration Form',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.indigo,
        scaffoldBackgroundColor: const Color(0xFFF6F7FB), // soft neutral bg
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          hintStyle: const TextStyle(color: Colors.grey),
        ),
      ),
      home: const RegistrationForm(),
    );
  }
}

class RegistrationForm extends StatefulWidget {
  const RegistrationForm({super.key});

  @override
  State<RegistrationForm> createState() => _RegistrationFormState();
}

class _RegistrationFormState extends State<RegistrationForm> {
  final _formKey = GlobalKey<FormState>();
  String? gender;
  String? selectedCourse;

  final List<String> courses = [
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "AI & Data Science",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Registration Form"),
        backgroundColor: Colors.indigo,
        elevation: 4,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(18),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildTitle("Full Name"),
              TextFormField(
                decoration: const InputDecoration(hintText: "Enter your full name"),
                validator: (value) => value!.isEmpty ? "Required" : null,
              ),
              const SizedBox(height: 16),

              _buildTitle("Email"),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(hintText: "Enter your email"),
                validator: (value) => value!.contains("@") ? null : "Enter valid email",
              ),
              const SizedBox(height: 16),

              _buildTitle("Password"),
              TextFormField(
                obscureText: true,
                decoration: const InputDecoration(hintText: "Enter your password"),
                validator: (value) => value!.length < 6 ? "Min 6 characters" : null,
              ),
              const SizedBox(height: 16),

              _buildTitle("Gender"),
              Row(
                children: [
                  Expanded(
                    child: RadioListTile<String>(
                      title: const Text("Male"),
                      value: "Male",
                      groupValue: gender,
                      activeColor: Colors.indigo,
                      onChanged: (value) => setState(() => gender = value),
                    ),
                  ),
                  Expanded(
                    child: RadioListTile<String>(
                      title: const Text("Female"),
                      value: "Female",
                      groupValue: gender,
                      activeColor: Colors.indigo,
                      onChanged: (value) => setState(() => gender = value),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              _buildTitle("Course"),
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(),
                value: selectedCourse,
                hint: const Text("Select your course"),
                items: courses.map((course) {
                  return DropdownMenuItem(
                    value: course,
                    child: Text(course),
                  );
                }).toList(),
                onChanged: (value) => setState(() => selectedCourse = value),
                validator: (value) => value == null ? "Please select course" : null,
              ),
              const SizedBox(height: 24),

              Center(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.indigo,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 14),
                  ),
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("Form Submitted Successfully")),
                      );
                    }
                  },
                  child: const Text(
                    "Register",
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTitle(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 15,
          fontWeight: FontWeight.w600,
          color: Colors.black87,
        ),
      ),
    );
  }
}
