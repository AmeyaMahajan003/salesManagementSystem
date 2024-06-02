import PyPDF2
import pandas as pd
import re

def extract_items_and_save_to_json(pdf_path):
    def extract_items_from_pdf(pdf_path):
      
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text()
        pattern = r'(\d+)\s+(.*?)\s+(\d+)\s+(.*?)\s+₹\s*(.*?)\s*₹\s*(.*?)\s*₹\s*(.*?)\s*\(.*?%\)\s*₹\s*(.*?)\s*\(.*?%\)\s*₹\s*(.*?)\s*'
        matches = re.findall(pattern, text)
        columns = ["Item No.", "Item Name", "HSN/SAC", "Quantity", "Unit Price", "Taxable Amount", "CGST Amount", "SGST Amount", "Total Amount"]
        df = pd.DataFrame(matches, columns=columns)
        return df
   
    df = extract_items_from_pdf(pdf_path)
    df["Item Name"] = df["Item Name"].apply(lambda x: re.sub(r'^\d+\s*', '', x))
    df = df.drop(columns=["Item No.", "Total Amount"])
    df.rename(columns={'Price/Unit': 'Taxable Amount'}, inplace=True)
    df.rename(columns={'Unit': 'Price/Unit'}, inplace=True)
    df[['Quantity', 'Unit']] = df['Quantity'].str.extract(r'(\d+)\s*(\D+)')
    df['Quantity'] = pd.to_numeric(df['Quantity'])
    order = ['Item Name','HSN/SAC','Quantity','Unit','Unit Price','Taxable Amount','CGST Amount','SGST Amount']
    df = df[order]
    json_data = df.to_json(orient = "records")

    print(json_data)

pdf_path = r'C:\Users\neela\OneDrive\Desktop\newapp\backend\router\bill.pdf'
extract_items_and_save_to_json(pdf_path)