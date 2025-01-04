// Função para gerar a tabela
function generateTable() {
  const tableBody = document.getElementById("table-body");
  let html = "";

  // Gera 20 linhas com 10 colunas cada (200 células)
  for (let i = 0; i < 20; i++) {
    html += "<tr>";
    for (let j = 1; j <= 10; j++) {
      const num = i * 10 + j;
      html += `<td data-num="${num}" class="cell">${num}</td>`;
    }
    html += "</tr>";
  }

  tableBody.innerHTML = html;
  attachClickEvents(); // Adiciona eventos às células
  updateTotal(); // Atualiza o total no carregamento
}

// Função para adicionar eventos de clique às células
function attachClickEvents() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const num = parseInt(cell.dataset.num);

      // Obtém os números salvos
      let selectedNumbers =
        JSON.parse(localStorage.getItem("selectedNumbers")) || [];

      if (selectedNumbers.includes(num)) {
        // Se já está selecionado, remove
        selectedNumbers = selectedNumbers.filter((n) => n !== num);
        cell.classList.remove("selected");
      } else {
        // Se não está selecionado, adiciona
        selectedNumbers.push(num);
        cell.classList.add("selected");
      }

      // Salva no localStorage
      localStorage.setItem("selectedNumbers", JSON.stringify(selectedNumbers));
      updateTotal(); // Atualiza o total
    });
  });
}

// Função para atualizar o total investido
function updateTotal() {
  const selectedNumbers =
    JSON.parse(localStorage.getItem("selectedNumbers")) || [];
  const total = selectedNumbers.reduce((acc, num) => acc + num, 0);

  // Atualiza o texto do totalizador
  const investidoElement = document.getElementById("investido");
  investidoElement.textContent = `R$ ${total.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;

  // Marca as células já selecionadas
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    const num = parseInt(cell.dataset.num);
    if (selectedNumbers.includes(num)) {
      cell.classList.add("selected");
    } else {
      cell.classList.remove("selected");
    }
  });
}

// Função para exportar a tela como PDF com layout de desktop
async function exportToPDF() {
  const element = document.querySelector(".container"); // Seleciona o elemento a ser exportado
  const exportButton = document.getElementById("export-pdf"); // Botão para ocultar

  // Adiciona uma classe para esconder o botão
  exportButton.classList.add("hidden");

  // Define a largura fixa de desktop antes de capturar
  const originalWidth = element.style.width;
  const originalTransform = document.body.style.transform;
  element.style.width = "1200px"; // Define a largura para o formato desktop
  document.body.style.transform = "scale(1)";

  // Usa html2canvas para capturar a tela
  const canvas = await html2canvas(element, {
    scale: 2, // Aumenta a qualidade da imagem capturada
    useCORS: true, // Permite carregar recursos de outros domínios
    windowWidth: 1200, // Força a largura de desktop
  });

  // Restaura o layout responsivo após a captura
  element.style.width = originalWidth;
  document.body.style.transform = originalTransform;

  // Remove a classe para exibir o botão novamente
  exportButton.classList.remove("hidden");

  const imgData = canvas.toDataURL("image/png"); // Converte o canvas em uma imagem
  const pdf = new jspdf.jsPDF("p", "mm", "a4"); // Cria uma instância do jsPDF

  // Define as dimensões da imagem para caber na página A4
  const pdfWidth = 210; // Largura da página A4 em mm
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // Adiciona a imagem ao PDF
  pdf.save("Desafio_200_Depositos.pdf"); // Salva o PDF com o nome especificado
}

// Adiciona evento ao botão
document.getElementById("export-pdf").addEventListener("click", exportToPDF);

// Inicializa a tabela ao carregar a página
document.addEventListener("DOMContentLoaded", generateTable);
