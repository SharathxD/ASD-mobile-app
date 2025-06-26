"use client"

import { useState } from "react"
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native"
import { TextInput, RadioButton, Button, ProgressBar, Card, Title, Paragraph } from "react-native-paper"
import { Picker } from "@react-native-picker/picker"

export default function ASDPrediction() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    age: "",
    ethnicity: "",
    sex: "",
    familyASD: "",
    jaundice: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    q9: "",
    q10: "",
  })
  const [prediction, setPrediction] = useState<string | null>(null)

  const ethnicityOptions = [
    "White European",
    "Asian",
    "Middle Eastern",
    "Black",
    "South Asian",
    "Hispanic",
    "Others",
    "Latino",
    "Pacifica",
    "Mixed",
    "Native Indian",
  ]

  const questions = [
    "Does your child look at you when you call their name?",
    "Is it easy to make eye contact with your child?",
    "Does your child point to show you things they're interested in?",
    "Does your child enjoy playing pretend games?",
    "Does your child try to comfort you when you're sad?",
    "Can your child easily describe their first word?",
    "Does your child wave goodbye without being reminded?",
    "Does your child follow where you're looking?",
    "Does your child show you things they find interesting?",
    "Does your child respond when you call their name from another room?",
  ]

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleNext = () => setStep((prev) => prev + 1)
  const handleBack = () => setStep((prev) => prev - 1)
  const handleRetake = () => {
    setStep(0)
    setFormData({
      age: "",
      ethnicity: "",
      sex: "",
      familyASD: "",
      jaundice: "",
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: "",
      q7: "",
      q8: "",
      q9: "",
      q10: "",
    })
    setPrediction(null)
  }

  const handleSubmit = async () => {
    try {
      const res = await fetch("https://flask-xi19.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to get prediction")

      const data = await res.json()
      setPrediction(data.prediction)
      handleNext()
    } catch (error) {
      console.error("Error:", error)
      setPrediction("An error occurred during prediction.")
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Let's Get Started!</Title>
              <Paragraph style={styles.cardSubtitle}>Tell us a little about your child.</Paragraph>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>How old is your child? (in months)</Text>
                <TextInput
                  value={formData.age}
                  onChangeText={(value) => handleInputChange("age", value)}
                  keyboardType="numeric"
                  style={styles.input}
                  mode="outlined"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>What is your child's background?</Text>
                <Picker
                  selectedValue={formData.ethnicity}
                  onValueChange={(value) => handleInputChange("ethnicity", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select background" value="" />
                  {ethnicityOptions.map((option) => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Is your child a boy or a girl?</Text>
                <RadioButton.Group onValueChange={(value) => handleInputChange("sex", value)} value={formData.sex}>
                  <View style={styles.radioGroup}>
                    <RadioButton.Item label="Boy" value="Male" />
                    <RadioButton.Item label="Girl" value="Female" />
                  </View>
                </RadioButton.Group>
              </View>
            </Card.Content>
          </Card>
        )
      case 1:
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>A Bit More About Your Child</Title>
              <Paragraph style={styles.cardSubtitle}>
                Just a couple more questions about your child's history.
              </Paragraph>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Has anyone in your family been diagnosed with ASD?</Text>
                <RadioButton.Group
                  onValueChange={(value) => handleInputChange("familyASD", value)}
                  value={formData.familyASD}
                >
                  <View style={styles.radioGroup}>
                    <RadioButton.Item label="No" value="No" />
                    <RadioButton.Item label="Yes" value="Yes" />
                  </View>
                </RadioButton.Group>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Did your child have jaundice when they were born?</Text>
                <RadioButton.Group
                  onValueChange={(value) => handleInputChange("jaundice", value)}
                  value={formData.jaundice}
                >
                  <View style={styles.radioGroup}>
                    <RadioButton.Item label="No" value="No" />
                    <RadioButton.Item label="Yes" value="Yes" />
                  </View>
                </RadioButton.Group>
              </View>
            </Card.Content>
          </Card>
        )
      case 2:
      case 3:
        const startIndex = step === 2 ? 0 : 5
        const endIndex = step === 2 ? 5 : 10
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Let's Talk About Your Child's Behavior</Title>
              <Paragraph style={styles.cardSubtitle}>
                {step === 2
                  ? "Answer these questions about how your child acts."
                  : "Answer these final questions about how your child acts."}
              </Paragraph>
              {questions.slice(startIndex, endIndex).map((question, index) => (
                <View key={index + startIndex} style={styles.questionContainer}>
                  <Text style={styles.question}>{question}</Text>
                  <RadioButton.Group
                    onValueChange={(value) => handleInputChange(`q${index + startIndex + 1}`, value)}
                    value={formData[`q${index + startIndex + 1}` as keyof typeof formData]}
                  >
                    <View style={styles.radioGroup}>
                      <RadioButton.Item label="Yes" value="Yes" />
                      <RadioButton.Item label="No" value="No" />
                    </View>
                  </RadioButton.Group>
                </View>
              ))}
            </Card.Content>
          </Card>
        )
      case 4:
        return (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Here's What We Found</Title>
              <Paragraph style={styles.cardSubtitle}>
                Based on your answers, here's what our friendly helper thinks:
              </Paragraph>
              <Text style={styles.prediction}>{prediction}</Text>
              <Text style={styles.disclaimer}>
                Remember, this is just a helper tool. If you're worried about your child's development, it's always best
                to talk to a doctor or a child development expert.
              </Text>
            </Card.Content>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Let's Learn About Your Child!</Text>
        <ProgressBar progress={step / 4} color="#4F46E5" style={styles.progressBar} />
        {renderStep()}
        <View style={styles.buttonContainer}>
          {step > 0 && step < 4 && (
            <Button mode="contained" onPress={handleBack} style={styles.button}>
              Back
            </Button>
          )}
          {step < 3 && (
            <Button mode="contained" onPress={handleNext} style={styles.button}>
              Next
            </Button>
          )}
          {step === 3 && (
            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
              Finish
            </Button>
          )}
          {step === 4 && (
            <>
              <Button mode="contained" onPress={handleBack} style={styles.button}>
                Back
              </Button>
              <Button mode="contained" onPress={handleRetake} style={styles.button}>
                Retake Quiz
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#4F46E5",
  },
  progressBar: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#4F46E5",
  },
  cardSubtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: "#6B7280",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#4B5563",
  },
  input: {
    backgroundColor: "#FFFFFF",
  },
  picker: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  radioGroup: {
    flexDirection: "row",
  },
  questionContainer: {
    marginBottom: 16,
  },
  question: {
    fontSize: 16,
    marginBottom: 8,
    color: "#4B5563",
  },
  prediction: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#4F46E5",
  },
  disclaimer: {
    fontSize: 14,
    color: "#6B7280",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
})

