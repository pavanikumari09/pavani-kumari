package com.example.counterapp
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
class MainActivity : AppCompatActivity() {
    private lateinit var textView: TextView
    private lateinit var increaseBTN: Button
    private lateinit var decreaseBTN: Button
    private lateinit var resetBTN: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        setUI()

        increaseBTN.setOnClickListener {
            val current = textView.text.toString().toInt()
            textView.text = (current + 1).toString()
        }

        decreaseBTN.setOnClickListener {
            val current = textView.text.toString().toInt()
            if (current > 0) {
                textView.text = (current - 1).toString()
            }
        }

        resetBTN.setOnClickListener {
            textView.text = "0"
        }

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
    }

    private fun setUI() {
        textView = findViewById(R.id.textView)
        increaseBTN = findViewById(R.id.increase)
        decreaseBTN = findViewById(R.id.decrease)
        resetBTN = findViewById(R.id.reset)
    }
}
